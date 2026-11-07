const fs=require('node:fs');
async function run(port,out){
 const target=await (await fetch('http://127.0.0.1:19222/json/new?about:blank',{method:'PUT'})).json();
 const ws=new WebSocket(target.webSocketDebuggerUrl);
 await new Promise(r=>ws.addEventListener('open',r,{once:true}));
 let id=0;const pending=new Map(),errors=[],failed=[],requests=[];
 ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p?.reject(m.error):p?.resolve(m.result);}else{
  if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);
  if(m.method==='Network.loadingFailed')failed.push(m.params);
  if(m.method==='Network.responseReceived')requests.push({url:m.params.response.url,status:m.params.response.status});
 }});
 const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));});
 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
 await send('Emulation.setDeviceMetricsOverride',{width:1000,height:700,deviceScaleFactor:1,mobile:false});
 if(process.env.TEST_OFFLINE) await send('Network.setBlockedURLs',{urls:['https://*','http://imasdk.googleapis.com/*']});
 await send('Page.navigate',{url:`http://localhost:${port}/`});
 await new Promise(r=>setTimeout(r,15000));
 if(port===18774){
  await send('Input.dispatchMouseEvent',{type:'mousePressed',x:500,y:540,button:'left',clickCount:1});
  await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:500,y:540,button:'left',clickCount:1});
  await new Promise(r=>setTimeout(r,8000));
 }
 const state=await send('Runtime.evaluate',{expression:`JSON.stringify({title:document.title,text:document.body.innerText.slice(0,500),canvases:[...document.querySelectorAll('canvas')].map(x=>({width:x.width,height:x.height})),runner:typeof Runner!=='undefined'&&Runner.instance_?{playing:Runner.instance_.playing,crashed:Runner.instance_.crashed}:null,pc:typeof pc!=='undefined'&&pc.Application?!!pc.Application.getApplication():null})`,returnByValue:true});
 const shot=await send('Page.captureScreenshot',{format:'png'});
 fs.writeFileSync(out+'/preview.png',Buffer.from(shot.data,'base64'));
 const report={offlineTest:!!process.env.TEST_OFFLINE,state:state.result.value,errors,failed,requests};fs.writeFileSync(out+'/verification.json',JSON.stringify(report,null,2));
 console.log(out,JSON.stringify({state:state.result.value,errors,failedCount:failed.length,httpErrors:requests.filter(x=>x.status>=400),externalCount:requests.filter(x=>!x.url.startsWith('http://localhost:')&&!x.url.startsWith('data:')).length}));
 if(port===18772){await send('Input.dispatchKeyEvent',{type:'keyDown',key:' ',code:'Space',windowsVirtualKeyCode:32});await send('Input.dispatchKeyEvent',{type:'keyUp',key:' ',code:'Space',windowsVirtualKeyCode:32});await new Promise(r=>setTimeout(r,1500));console.log('after-space',await send('Runtime.evaluate',{expression:'JSON.stringify({playing:Runner.instance_.playing,distance:Runner.instance_.distanceRan,crashed:Runner.instance_.crashed})',returnByValue:true}));}
 ws.close();await fetch('http://127.0.0.1:19222/json/close/'+target.id);
}
Promise.all([run(18774,__dirname),run(18772,require('path').resolve(__dirname,'../dinosaur-game-main'))]).catch(e=>{console.error(e);process.exitCode=1;});
