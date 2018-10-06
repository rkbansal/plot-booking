var socket = io();
            var isLoaded = false;
            var localData = [];
            socket.on('initialData', (data)=>{
                console.log('connected to the server');
                if(!isLoaded){
                    $('img').mapster({
                    fillColor: "d42e16",
                    isDeselectable: false,
                    onClick: function(e){
                        if(!!e.key && localData.indexOf(e.key) < 0){
                            var retVal = confirm("Do you really want to book this plot?");
                            if(retVal == true){
                                socket.emit('selected', e.key);
                            }else{
                                document.getElementById("overlay").style.display = "block";
                                setTimeout(function(){
                                    $('img').mapster('set', false, e.key);
                                    document.getElementById("overlay").style.display = "none";
                                }, 0);
                            }
                        }
                    }
                });
                for(let i=0; i<data.length; i++){
                    localData[i] = data[i];
                    $('img').mapster('set', true, data[i]);
                }
                isLoaded = true
                }
            });
            socket.on('selected', (key)=>{
                $('img').mapster('set', true, key);
                console.log('from server', key);
            });