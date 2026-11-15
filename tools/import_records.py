#!/usr/bin/env python3
"""Morrice softball PDF -> existing historical search schema.

Designed for the program's selectable-text, same-layout record book.
Hard-fails on empty/unsupported PDFs, large unexplained changes or unknown headings.
Never edits the source PDF; output is a built-site JS file, not a repository commit.
"""
from __future__ import annotations
import argparse
import collections
import copy
import datetime
import difflib
import json
import pathlib
import re
import sys
import unicodedata

try:
    import fitz
except ImportError:
    raise SystemExit('Install PyMuPDF first: pip install pymupdf')


DATE_RE = re.compile(r'(?<!\d)(\d{1,2}-\d{1,2}-\d{4})(?!\d)')
YEAR_RE = re.compile(r'(?:19|20)\d{2}')
SEASON_RE = re.compile(r'^(1951/52|(?:19|20)\d{2})\b')
VALUE_RE = re.compile(r'^\s*(?:\.\s+)?((?:\d+(?:\.\d+)?|\.\d+))\s+(.+)$')
SPACED_RE = re.compile(r'\s{2,}')
REMARKS = ('missing', 'incomplete', 'unknown', 'unverified')


def norm(s):
    return re.sub(r'[^a-z0-9]', '', unicodedata.normalize('NFKD', str(s)).lower())


def clean(s):
    return re.sub(r'\s+', ' ', str(s)).strip()


def load_js_data(path):
    s = pathlib.Path(path).read_text(encoding='utf-8')
    m = re.search(r'window\.MORRICE_RECORDS_DB\s*=\s*(\{.*\})\s*;\s*$', s, re.S)
    if not m:
        raise ValueError(f'Could not find MORRICE_RECORDS_DB JSON in {path}')
    return json.loads(m.group(1))


def get_pages(path):
    pdf = fitz.open(str(path))
    if pdf.needs_pass:
        raise ValueError('Password-protected PDFs cannot be automatically imported')
    if len(pdf) < 12:
        raise ValueError('Expected a multi-page record book, not a short PDF')
    pages = [page.get_text(sort=True).splitlines() for page in pdf]
    if sum(len(''.join(p)) for p in pages) < 15000:
        raise ValueError('PDF has too little selectable text (possibly a scan). No records changed.')
    return pages


def known_people(db):
    return sorted({r['name'] for r in db['records'] if r['group'] != 'Team' and r.get('name') and not r['name'].isdigit()}, key=lambda x: -len(x))


def record_row_parts(original, group, metric, names):
    raw = clean(original)
    if metric in ('Hitting for the Cycle', 'Perfect Games, 5 inn Innings'):
        value = '—'
        rest = raw
    elif metric == 'No Earned Runs Streak' and re.match(r'^\d+\s+innings?\b', raw, re.I):
        number, rest = raw.split(' ', 1)
        value = number
        rest = re.sub(r'^innings?\s+', '', rest, flags=re.I)
        streak = f'{number} innings'
    else:
        match = VALUE_RE.match(original)
        if not match:
            raise ValueError(f'Cannot parse record value in {metric}: {raw}')
        value, rest = match.groups()
        rest = clean(rest)
    name = ''
    if group != 'Team':
        for p in names:
            if norm(rest[:len(p)]) == norm(p) and (len(rest) == len(p) or not rest[len(p)].isalpha()):
                name = p
                rest = rest[len(p):].strip()
                break
        if not name:
            # New athletes can be imported if name occupies the standard name column.
            segments = SPACED_RE.split(re.sub(r'^\s*(?:\.\s+)?(?:\d+(?:\.\d+)?|\.\d+)\s+', '', original).strip())
            if not segments or len(segments) < 2 or len(segments[0].split()) < 2:
                raise ValueError(f'New or changed athlete name needs review: {raw}')
            name = segments[0].strip()
            rest = clean(' '.join(segments[1:]))
    else:
        # All team records name a year, opponent, or streak/league.
        name = rest
        rest = ''
        # Date at the end is the detail; remaining text is opponent.
        d = list(DATE_RE.finditer(name))
        if d and d[-1].end() == len(name):
            rest = d[-1].group(1)
            name = name[:d[-1].start()].strip()
        elif metric.endswith(', Season') and re.match(r'^\d{4}$', name):
            pass
        elif metric == 'League Winning Streak':
            # League stays in name and year range goes into detail.
            m = re.search(r'\b\d{4}-\d{4}\b', name)
            if m:
                rest = m.group(0)
                name = name[:m.start()].strip()
    if group != 'Team':
        d = list(DATE_RE.finditer(rest))
        if d and d[-1].end() == len(rest):
            rest = clean(rest[:d[-1].start()]) + ' · ' + d[-1].group(1) if rest[:d[-1].start()].strip() else d[-1].group(1)
        if metric == 'No Earned Runs Streak':
            rest = f'{streak} · {rest}'
    years = YEAR_RE.findall(rest or name)
    if group != 'Team' and 'Career' in metric and re.search(r'\b(?:19|20)\d{2}-(?:19|20)\d{2}', rest):
        y = re.search(r'((?:19|20)\d{2}-(?:19|20)\d{2})', rest).group(1)
    else:
        y = years[-1] if years else ''
    if group == 'Team' and not y:
        years = YEAR_RE.findall(name)
        y = years[-1] if years else ''
    flags = ['Incomplete historical entry'] if any(x in original.lower() for x in REMARKS) else []
    return dict(value=value,name=name,detail=clean(rest),year=y,raw=raw,flags=flags)


def identify_heading(line, heads):
    n = norm(line.strip())
    if n in heads:
        return heads[n]
    if n.startswith('earnedrunaverageseason') and '7xerdividebyip' in n:
        return 'Earned Run Average, Season'
    return None


def extract_stats(pages, reference):
    # For duplicate headings, disambiguate by current section (Pitching vs Team).
    heads = collections.defaultdict(dict)
    for r in reference['records']:
        key = (r['group'],r.get('groupDetail',''))
        heads[key][norm(r['metric'])] = r['metric']
    rows = []
    group = 'Batting'
    gd = ''
    metric = None
    unknown = []
    for page_idx in range(2,len(pages)):
        for text in pages[page_idx]:
            line = text.strip()
            if not line: continue
            n = norm(line)
            if n == 'teamrecords':
                group,gd,metric = 'Team','',None
                continue
            if n == 'pitchingrecords':
                group,gd,metric = 'Pitching','',None
                continue
            if n == 'pitching' and group == 'Team':
                gd,metric='Team Pitching',None
                continue
            if n == 'battingrecords': continue
            heading = identify_heading(line, heads.get((group,gd),{}))
            if heading:
                metric=heading
                continue
            if not metric:
                continue
            if VALUE_RE.match(line) or metric in ('Hitting for the Cycle', 'Perfect Games, 5 inn Innings'):
                rows.append(dict(group=group,groupDetail=gd,metric=metric,original=text,raw=clean(text),page=page_idx+1))
            elif line.strip(' .'):
                unknown.append((page_idx+1,metric,line))
    if unknown:
        raise ValueError('Unrecognized record-book lines (format changed): '+repr(unknown[:8]))
    return rows


def build_records(rows, ref, notes):
    old_map = collections.defaultdict(list)
    for r in ref['records']:
        old_map[(r['group'],r.get('groupDetail',''),r['metric'],norm(r['raw']))].append(r)
    names = known_people(ref)
    out=[]
    parsed=[]
    for row in rows:
        key=(row['group'],row['groupDetail'],row['metric'],norm(row['raw']))
        candidates=old_map.get(key)
        if candidates:
            old=copy.deepcopy(candidates.pop(0))
            old['page']=row['page']
            parsed.append(False)
            out.append(old)
        else:
            fields=record_row_parts(row['original'],row['group'],row['metric'],names)
            out.append({**row,**fields})
            parsed.append(True)
    changed=sum(parsed)
    removed=sum(len(v) for v in old_map.values())
    notes.append(f'Individual/team records: {len(out)} rows; {changed} new/modified, {removed} older rows not in PDF')
    if len(out)<max(100,int(len(ref['records'])*.80)) or changed>max(100,int(len(ref['records'])*.25)):
        raise ValueError(f'Large record-book change: {changed} changed/new and {removed} absent; verify PDF formatting before publishing')
    lastid = max((int(x['id'][1:]) for x in ref['records'] if re.fullmatch(r'R\d+',x.get('id',''))), default=0)
    for row in out:
        row.pop('original',None)
        if not row.get('id'):
            lastid += 1
            row['id'] = f'R{lastid:04d}'
    return out


def extract_seasons(pages, ref, notes):
    old={r['year']:r for r in ref['seasons']}
    out=[]
    for text in pages[0]:
        ln=text.strip()
        m=SEASON_RE.match(ln)
        if not m:continue
        yr=m.group(1)
        fields=SPACED_RE.split(ln)
        # Source's 1951/52 shorthand has no league/coach.
        if yr in old and norm(ln)==norm(' '.join(str(old[yr].get(k,'')) for k in ['year','overall','conferenceRecord','coach','league'])):
            out.append(copy.deepcopy(old[yr]));continue
        if len(fields)==2 and not re.fullmatch(r'\d+-\d+(?:-\d+)?',fields[1]):
            out.append(dict(year=yr,overall='',conferenceRecord='',coach='',league='',page=1,status=fields[1],flags=[]));continue
        overall=fields[1] if len(fields)>1 else ''
        rest=fields[2:]
        conf=rest.pop(0) if rest and (re.fullmatch(r'[\d-]+\*?(?:\s*co)?',rest[0]) or rest[0]=='*') else ''
        league=''
        if rest and rest[-1] in ('GAC','GAC Blue','SMAA','SMAA North','Mid-State','Motor Valley','Independent'):
            league=rest.pop()
        elif rest:
            for name in ('GAC Blue','SMAA North','Mid-State','Independent','Motor Valley','GAC','SMAA'):
                if rest[-1].endswith(name):
                    rest[-1]=rest[-1][:-len(name)].strip()
                    league=name
                    break
        coach=' '.join(rest)
        out.append(dict(year=yr,overall=overall,conferenceRecord=conf,coach=coach,league=league,page=1,flags=[]))
    if len(out)<max(10,int(len(ref['seasons'])*.8)):
        raise ValueError('Season table appears incomplete')
    notes.append(f'Season history: {len(out)} rows')
    return out


def extract_tournament(pages, ref, notes):
    # Preserve exact transcriptions where present. Recognize and parse inserted or changed games.
    olds=collections.defaultdict(list)
    for r in ref['tournament']:
        olds[norm(r['raw'])].append(r)
    rows=[]
    current_year=None;current_round='District';current_site=''
    for pg in (1,2):
        stop=False
        for text in pages[pg]:
            ln=text.strip()
            if not ln:continue
            if '43-45' in ln and ('District' in ln or '.488' in ln):stop=True;break
            if 'Batting Records' in ln:stop=True;break
            if ln=='Tournament History' or ln.startswith('Date   Location') or ln.startswith('Date  Location'):
                continue
            bits=SPACED_RE.split(ln)
            if not bits:continue
            newyear=SEASON_RE.match(bits[0])
            if newyear:
                current_year=newyear.group(1)
                if len(bits)==1 or (len(bits)==2 and 'team' in bits[1].lower()):continue
                bits=bits[1:]
                current_round='District'
            if not current_year:continue
            if re.match(r'^(?:Reg|QF|SF|Final)\s*@',bits[0]):
                site=bits.pop(0)
                current_site=site
                current_round='Regional' if site.startswith('Reg') else 'Quarterfinal' if site.startswith('QF') else 'Semifinal' if site.startswith('SF') else 'Final'
            else:
                site=None
            if not bits:continue
            score_idx=next((i for i,b in enumerate(bits) if re.fullmatch(r'\d+-\d+',b)),None)
            if score_idx is None:
                # Preserve no-score tournament entries but avoid stray year headings.
                if not bits or all(re.fullmatch(r'\d{4}',b) for b in bits):continue
            # If a year was at the start, first non-year cell is the site.
            if newyear and site is None:
                current_site=bits.pop(0)
            if not bits:continue
            opponent=bits.pop(0)
            score='';innings='';winner=''
            for bit in bits:
                if re.fullmatch(r'\d+-\d+',bit):score=bit
                elif re.fullmatch(r'\d+\s+inn',bit,re.I):innings=bit
                else:winner=bit
            row=dict(year=current_year,round=current_round,site=current_site,opponent=opponent,score=score,innings=innings,districtWinner=winner,page=pg+1,raw=' | '.join(SPACED_RE.split(ln)),flags=[])
            if not score:row['flags']=['Score not recorded in source','Result not provided']
            olds_match=olds.get(norm(row['raw']))
            if olds_match:
                orig=copy.deepcopy(olds_match.pop(0));orig['page']=pg+1;rows.append(orig)
            else:rows.append(row)
        if stop:break
    added=sum(1 for r in rows if norm(r['raw']) not in {norm(x['raw']) for x in ref['tournament']})
    missing=sum(map(len,olds.values()))
    if len(rows)<max(30,int(len(ref['tournament'])*.8)) or added>30:
        raise ValueError(f'Tournament parser mismatch: found {len(rows)}, added {added}, removed {missing}')
    notes.append(f'Tournament history: {len(rows)} games; {added} new/changed, {missing} previous rows not in PDF')
    return rows


def main():
    cli=argparse.ArgumentParser(description=__doc__)
    cli.add_argument('--pdf',required=True)
    cli.add_argument('--reference',required=True)
    cli.add_argument('--output',required=True)
    cli.add_argument('--report',default='')
    args=cli.parse_args()
    ref=load_js_data(args.reference)
    pages=get_pages(args.pdf)
    notes=[]
    stats=extract_stats(pages,ref)
    records=build_records(stats,ref,notes)
    seasons=extract_seasons(pages,ref,notes)
    tournament=extract_tournament(pages,ref,notes)
    db=copy.deepcopy(ref)
    db['source']='Morrice Softball Records.pdf'
    db['sourcePages']=len(pages)
    db['asOf']=str(max((int(r['year']) for r in seasons if r['year'].isdigit()),default=2026))
    db['seasons']=seasons
    db['tournament']=tournament
    db['records']=records
    db['summary']={**db.get('summary',{}),'records':len(records),'seasons':len(seasons),'tournament':len(tournament)}
    output=pathlib.Path(args.output);output.parent.mkdir(parents=True,exist_ok=True)
    output.write_text('/* Auto-generated at deployment from the uploaded Morrice record book. */\nwindow.MORRICE_RECORDS_DB = '+json.dumps(db,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
    report='MORRICE RECORD BOOK IMPORT\n'+'\n'.join(notes)+'\nSource: '+args.pdf+'\n'
    print(report)
    if args.report: pathlib.Path(args.report).write_text(report,encoding='utf-8')

if __name__ == '__main__':
    try:main()
    except Exception as exc:
        sys.exit('RECORDS IMPORT STOPPED — public site not changed: '+str(exc))
