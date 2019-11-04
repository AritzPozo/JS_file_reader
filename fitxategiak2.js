getExten={'image/jpeg':"jpg",'image/png':"png",'image/gif':"gif",'image/bmp':"bmp",'image/tiff':"tiff",'application/pdf':"pdf",'application/msword':"doc",'application/vnd.openxmlformats-officedocument.wordprocessingml.document':"docx",'application/vnd.ms-excel':"xls",'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':"xlsx",'application/vnd.ms-powerpoint':"ppt",'application/vnd.openxmlformats-officedocument.presentationml.presentation':"pptx",'application/vnd.oasis.opendocument.text':"odt",'application/vnd.oasis.opendocument.spreadsheet':"ods",'application/vnd.oasis.opendocument.presentation':"odp",'text/plain':"txt",'text/csv':"csv",'text/plain':"bd",'text/plain':"db"};
getExtenImg={'image/jpeg':"jpg",'image/png':"png",'image/gif':"gif",'image/bmp':"bmp",'image/tiff':"tiff"};
getExtenDoc={'application/pdf':"pdf",'application/msword':"doc",'application/vnd.openxmlformats-officedocument.wordprocessingml.document':"docx",'application/vnd.ms-excel':"xls",'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':"xlsx",'application/vnd.ms-powerpoint':"ppt",'application/vnd.openxmlformats-officedocument.presentationml.presentation':"pptx",'application/vnd.oasis.opendocument.text':"odt",'application/vnd.oasis.opendocument.spreadsheet':"ods",'application/vnd.oasis.opendocument.presentation':"odp",'text/plain':"txt",'text/csv':"csv",'text/plain':"bd",'text/plain':"db"};
getMime={"bd":'text/plain',"db":'text/plain',"jpeg":'image/jpeg',"jpg":'image/jpeg',"png":'image/png',"gif":'image/gif',"bmp":'image/bmp',"tiff":'image/tiff',"pdf":'application/pdf',"doc":'application/msword',"docx":'application/vnd.openxmlformats-officedocument.wordprocessingml.document',"xls":'application/vnd.ms-excel',"xlsx":'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',"ppt":'application/vnd.ms-powerpoint',"pptx":'application/vnd.openxmlformats-officedocument.presentationml.presentation',"odt":'application/vnd.oasis.opendocument.text',"ods":'application/vnd.oasis.opendocument.spreadsheet',"odp":'application/vnd.oasis.opendocument.presentation',"txt":'text/plain',"csv":'text/csv'};  
function getftomyme(formato){
    if(formato.length>5){
        mimetype=formato;
        fmt=getExten[formato]
        if(typeof fmt=="undefined"){allowwrite=0; }
    }else{ 
        fmt=formato;
        mimetype=getMime[formato]
        if(typeof mimetype=="undefined"){allowwrite=0; }
    }
    return [fmt,mimetype];
}
function createLog(txt){
   //console.log("%cFile log: "+"%c   "+txt+"","background-color:black;font-weight:bold;color:pink","color:red");
}
function fitxategiaIrakurri(fitxIzena,formato,exitFunc,failFunc){
    if(formato!=null){
        fitxIzena=fitxIzena+'.'+formato
    }
    var type = window.PERSISTENT;
    var size = 5*1024*1024;
    window.requestFileSystem(type, size, successCallback, errorCallback);
    function successCallback(fs) {
        fs.root.getFile(fitxIzena, {}, function(fileEntry) {
          fileEntry.file(function(file) {
             var reader = new FileReader();
             reader.onloadend = function(e) {
             //    console.log(e.result);
                 if(exitFunc!=null){exitFunc(this.result);}
             };
             reader.readAsText(file);
          }, errorCallback);
       }, errorCallback);
    }
    function errorCallback(error) {
        if(failFunc!=null){failFunc(this.result);}
    }
}
function fitxategiaIdatzi(fitxIzenaOrig,texto,formato,exitFunc,failFunc){
    allowwrite=1;
    if(typeof texto=="string"){
    if(formato.lengnth>4){
        mimetype=formato;
        fmt=getExten[formato];if(fmt==undefined){allowwrite=0; }
    }else{ 
        fmt=formato;
        mimetype=getMime[formato];if(mimetype==undefined){allowwrite=0;}
    }
    if(formato!=null){fitxIzena=fitxIzenaOrig+'.'+formato;}else{fitxIzena=fitxIzenaOrig;}
    console.log(allowwrite);
    if(allowwrite==1){
        var blob = new Blob([texto], {type: mimetype});
        var type = window.PERSISTENT; //var type = window.TEMPORARY;
        var size=blob.size+1024;
        window.requestFileSystem(type, size, successCallback, errorCallback)
        function successCallback(fs) {
            
            fs.root.getFile(fitxIzena, {create: true}, function(fileEntry) {
                fileEntry.createWriter(function(fileWriter) {
                    
                    fileWriter.onwriteend = function(e) {
                        createLog('Write ('+fitxIzena+') completed.');
                        if(exitFunc!=null){exitFunc(this.result);}                      
                    };
                    fileWriter.onerror = function(e) {
                        createLog(fitxIzena+': Write failed ');
                        setTimeout(function(){
                            fitxategiaIdatzi(fitxIzenaOrig,texto,formato,exitFunc,failFunc);
                        },Math.random() * (4000));
                    };
                    //var blob = new Blob([texto], {type: 'text/plain'});
                    if(fileWriter.write(blob)){}
                }, function(e){fitxategiAkatsKodeak(e['code'],failFunc);});
            }, function(e){fitxategiAkatsKodeak(e['code'],failFunc);});
        }
    
        function errorCallback(error) {
            createLog(fitxIzena+': ERROR ESCRITURA');
            fitxategiAkatsKodeak(error['code'],failFunc);
        } 
    }else{
        createLog(fitxIzena+': Escritura de tipo MIME no permitida ' + mimetype);
    }}
}
function fitxategiaKendu(fitxIzena){
    var type = window.PERSISTENT; //var type = window.TEMPORARY;
    var size = 5*1024*1024;
    window.requestFileSystem(type, size, successCallback, errorCallback)
    function successCallback(fs) {
       fs.root.getFile(fitxIzena, {create: false}, function(fileEntry) {
 
          fileEntry.remove(function() {
             createLog(fitxIzena+': File removed.');
             if(typeof galeria!='undefined'){
             dtkgal=Object.keys(galeria.datuak);
             for(gal=0;gal<dtkgak.lengnth;gal++){
                 if(Galeria.datuak[dtkgak[gal]]['oror_izena']==fitxIzena){
                    file_key=Galeria.datuak[dtkgak[gal]]['esdb_id'];
                    delete Galeria.datuak[file_key];
                    Galeria.dbGorde();
                    break;
                 }
             }
            }
          }, errorCallback);
       }, errorCallback);
    }
    function errorCallback(error) {
        return 0;
    }
}
function fitxategiAkatsKodeak(akaId,akaFuntzio){
    switch(akaId){
        case 1:
            //1 	NOT_FOUND_ERR
            akadeskriba=-29;
            break;
        case 2:
            //1 	SECURITY_ERR
            akadeskriba=-30;
            break;
        case 3:
            //1 	ABORT_ERR
            akadeskriba=-31;
            break;
        case 4:
            //1 	NOT_READABLE_ERR
            akadeskriba=-32;
            break;
        case 5:
            //1 	ENCODING_ERR
            akadeskriba=-33;
            break;        
        case 6:
            //1 	NO_MODIFICATION_ALLOWED_ERR
            akadeskriba=-34;
            break;  
        case 7:
            //1 	INVALID_STATE_ERR
            akadeskriba=-35;
            break;  
        case 8:
            //1 	SYNTAX_ERR
            akadeskriba=-36;
            break;  
        case 9:
            //1 	INVALID_MODIFICATION_ERR
            akadeskriba=-37;
            break;     
        case 10:
            //1 	QUOTA_EXCEEDED_ERR
            akadeskriba=-38;
            break;                                                             
        case 11:
            //1 	TYPE_MISMATCH_ERR
            akadeskriba=-39;
            break;
        case 12:
            //1 	PATH_EXISTS_ERR
            akadeskriba=-40;
            break;                        
        default:
            break;
    }
    if(akaId<=12){
        akatsak(akadeskriba);
    }
    if(akaFuntzio!=null){
        akaFuntzio();
    }
}
function removeFile(fitxIzena){
    fitxategiaKendu(fitxIzena)
}
 function readModules(fitxIzena,funtzioa,funtziFail) {
    if(empresaId!=0){
        fitxategiaIrakurri(empresaId+"_"+fitxIzena,"db",funtzioa,null);
    }
 }
 function saveBlobFromUrl(fileName,url,moduloid,mimetype){	
    $(document).ready(function(){
        $.post(rutaRaizApi+'?actype='+moduloid+'&actnum=6&apiKey='+apiKey,{
            time:new Date().getTime()+gtmvariator,
            mod:moduloid,
            acc:6,
            datuak:JSON.stringify(url),
            version:-1,
            secCode:0,
            empresaId:empresaId,
            force:1
        },
        function(output){
			output=JSON.parse(output);
			txekbaieztua(output['akatsa'],output['apikey'],output['datuak'],
			function(output){
                
				contedo=output;
				if(getExten[mimetype]!=undefined){
                    fitxategiaIdatzi(fileName,contedo,mimetype,null,null);
                }
			});
		});
	});
}
 function blogtoimage(div,buffer){
    if(typeof buffes =="object"){
        var blob = new Blob( [ buffer ], { type: "image/jpeg" } );
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL( blob );
    }else{
        imageUrl=buffer;
    }
    var img = document.querySelector( "#"+div );
    img.src = imageUrl;
}
function blobToBase64(blob,ct) {
    var reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onloadend = function() {
        base64data = reader.result;                
        ct(base64data)
    }
}
function writeFile(fitxIzena,texto){
    fitxategiaIdatzi(fitxIzena,texto,'txt',null,null);
}
function saveModules(fitxIzena,texto){
    if(empresaId!=0){
        fitxategiaIdatzi(empresaId+"_"+fitxIzena,texto,'db',null,null);
    }
}
function displayFitxategi(fitxIzena) {
    fitxategiaIrakurri(fitxIzena,null,function(outp){
        console.log(outp);
    });
 }
function readFileAndAsign(fitxIzena,memadd) {
    console.log("FITX: "+fitxIzena);
    console.log("VAR: "+memadd);
    fitxategiaIrakurri(fitxIzena,"txt",function(outp){
        console.log(outp);
        val=outp.toString()
        eval(memadd.toString()+"='"+val+"'");
    });
 }
 function readFileAndExec(fitxIzena,funtzioa) {
    fitxategiaIrakurri(fitxIzena,"txt",funtzioa,null)
 }	
 function writeBlob(fitxIzena,texto,tipoBlob){   
    fitxategiaIdatzi(fitxIzena,texto,tipoBlob,null,null)
 }
 function blobToFileList(campfl,fitxIzena,mime) {
    ftocombi=getftomyme(mime);
    fmt=ftocombi[0];
    mimetype=ftocombi[1];
    var type = window.PERSISTENT; //var type = window.TEMPORARY;
    var size = 5*1024*1024;
    txt2return='';
    return window.requestFileSystem(type, size, successCallback, errorCallback);
 
    function successCallback(fs) {
        fs.root.getFile(fitxIzena, {}, function(fileEntry) {
 
          fileEntry.file(function(file) {
             var reader = new FileReader();
             reader.onloadend = function(e) {
                 console.log(this.result);
                fitxategiTemporalak[campfl]=[this.result,mime];
             };
             reader.readAsText(file);
          }, errorCallback);
       }, errorCallback);
       return txt2return;
    }
    function errorCallback(error) {
        return -1;
    }
}
 function readBlob(fitxIzena,werror){
    fitxategiaIrakurri(fitxIzena,null,null,null)
 }
 function blobtobackground(filearray,divName,tp){
    if(filearray['type']==1){
        ftocombi=getftomyme(filearray['mime']);
        fmt=ftocombi[0];
        mimetype=ftocombi[1];
        var type = window.PERSISTENT; //var type = window.TEMPORARY;
        var size = 5*1024*1024;
        txt2return='';
        return window.requestFileSystem(type, size, successCallback, errorCallback);
    
        function successCallback(fs) {
            fs.root.getFile(filearray['src'], {}, function(fileEntry) {
    
            fileEntry.file(function(file) {
                var reader = new FileReader();
                reader.onloadend = function(e) {
                    var blob = new Blob( [ this.result ], { type:mimetype } );
                    var urlCreator = window.URL || window.webkitURL;
                    var imageUrl = urlCreator.createObjectURL( blob );
                    if(tp==0){
                        $("#"+divName).css("background-image","url('"+imageUrl+"')")
                    }else{
                        var img = document.querySelector( "#"+divName );
                        img.src = imageUrl;
                    }
                    
                };
                reader.readAsText(file);
            }, errorCallback);
        }, errorCallback);
        return txt2return;
        }
        function errorCallback(error) {
            return -1;
        } 
    }else{
        if(tp==0){
            $("#"+divName).css("background-image","url('"+filearray['src']+"')")
        }else{
            var img = document.querySelector( "#"+divName );
            img.src = filearray['src'];
        }
    }
 }
 