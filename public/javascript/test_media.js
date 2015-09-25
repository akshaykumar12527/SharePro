function detect(){
var session = {
                    audio: true,
                    video: DetectRTC.hasWebcam
                };
                navigator.getUserMedia = ( navigator.getUserMedia ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia);
                //alert('testing');
                if(navigator.getUserMedia){
                navigator.getUserMedia(session, function(stream){
                	setUsermedia(stream);
                	return true;
                	//alert('camera and microphone is working');
                }, function(error) {
                	alert('There may be some problem with your media devices or your browser doest not support for media devices');
                });
                }
                else{
                	//alert("doest not support getusermedia");
                	return false;
                }
}

            function setUsermedia(stream) {
                    mediaStream = stream;
                	    //alert(stream);
                    videoElement.src = window.URL.createObjectURL(stream);
                    videoElement.play();
                    videoElement.muted = true;
                    videoElement.controls = false;
                    
                }
            function startRecording(){
            	timer=setInterval(function(){
                	var str='0'+min+':0'+sec;
                	var str1='0'+min+':'+sec;
                	var str2=min+':0'+sec;
                	document.getElementById('time_span').innerHTML=(min<10?(sec<10?str:str1):(sec<10?str2:min+':'+sec));
                	sec++;
                    if(sec>=60)
                    	{
                    	min++;
                    	sec=0;
                    	}
                    duration++;
                },1000);
                //alert(videoElement.src);
                // it is second parameter of the RecordRTC
                var audioConfig = {};
                if(!isRecordOnlyAudio) {
                    audioConfig.onAudioProcessStarted = function() {
                        // invoke video recorder in this callback
                        // to get maximum sync
                  	   videoRecorder.startRecording();
                    };
                }
                
                audioRecorder = RecordRTC(mediaStream, audioConfig);
                
                if(!isRecordOnlyAudio) {
                    // it is second parameter of the RecordRTC
                    var videoConfig = { type: 'video' };
                    videoRecorder = RecordRTC(mediaStream, videoConfig);
                }
                
                audioRecorder.startRecording();
                
                // enable stop-recording button
                btnStopRecording.disabled = false;
            }
            