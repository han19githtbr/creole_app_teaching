import json,base64,re,numpy as np
from scipy import ndimage
nodes=json.load(open('nodes.json'))
bank={b['id']:b for b in json.load(open('bank-elements.json'))}
GW,GH=150,100
def dec(s):
    if not s: return None
    b=np.frombuffer(base64.b64decode(s),dtype=np.uint8)
    bits=np.unpackbits(b,bitorder='little')[:GW*GH].reshape(GH,GW).astype(bool)
    return bits
ov={}
for l in open('element-map.txt'):
    l=l.strip()
    if not l or l.startswith('#'): continue
    k,v=l.split(':',1); ov[k.strip()]=[p.strip() for p in v.split(';')]
missing=[k for k in bank if k not in ov]; print('missing',missing)
out={}; warn=[]
for k,b in bank.items():
    byid={x['i']:x for x in nodes[k]['nodes']}
    ids=sorted(byid)
    res=[]
    for ei,e in enumerate(b['elements']):
        spec=ov[k][ei]
        if spec=='-': res.append(None); continue
        if ',' in spec and '+' not in spec and not spec.replace(',','').isdigit()==False and spec.count(',')==1 and int(spec.split(',')[0])>60:
            x,y=map(float,spec.split(',')); res.append({'x':round(x/12,1),'y':round(y/8,1),'bw':8,'bh':10}); continue
        sel=[int(s) for s in spec.split('+')]
        m=np.zeros((GH,GW),bool)
        for i in sel:
            d=dec(byid[i].get('m')) if byid.get(i) else None
            if d is None: warn.append((k,ei,'nomask',i)); continue
            m|=d
        if not m.any(): warn.append((k,ei,'empty')); res.append(None); continue
        occ=np.zeros_like(m)
        last=max(sel)
        for i in ids:
            if i<=last or i in sel: continue
            x=byid[i]
            if not x.get('bb') or x['bb']['area']>0.7 or not x.get('mo'): continue
            occ|=dec(x['mo'])
        vis=m&~occ
        if vis.sum()<max(3,0.15*m.sum()): vis=m
        # largest component
        lab,n=ndimage.label(vis)
        if n>1:
            sizes=ndimage.sum(vis,lab,range(1,n+1)); vis=lab==(1+int(np.argmax(sizes)))
        dt=ndimage.distance_transform_edt(np.pad(vis,1))[1:-1,1:-1]
        cy,cx=np.unravel_index(np.argmax(dt),dt.shape)
        ys,xs=np.where(vis)
        res.append({'x':round((cx+.5)/GW*100,1),'y':round((cy+.5)/GH*100,1),
                    'bw':round((xs.max()-xs.min()+1)/GW*100,1),'bh':round((ys.max()-ys.min()+1)/GH*100,1)})
    out[k]=res
json.dump({k:[None if a is None else [a['x'],a['y']] for a in v] for k,v in out.items()},open('../../../src/lib/storyElementAnchors.json','w'),separators=(',',':'))
print(len(out),'images; warnings',warn[:10], len(warn))
absent=sum(1 for v in out.values() for a in v if a is None); print('absent elements',absent,'of',len(out)*4)
