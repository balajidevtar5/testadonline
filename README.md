Deployment steps. 
 
step 1: Delete old dist (build) file, before creating a build
step 2: Delete current uploaded file in iis except web.config
step 3: Upload dist folder

Deployment in BETA
-> Change basename in BrowserRouter App.tsx
-> Add homepage in pacakge.json
-> Add public path in webpack.config /BETA/web
-> in i18 fetch /BETA/web/asset-manifest.json
-> add verstion for inde.js in index.html
-> add version for bundle in webconfig 


Deployment in Live
in index.tsx we need to change ^http:\/\/113.212.87.157:3001\/api/ to adonline 