function getPageName(url) {
    var index = url.lastIndexOf("/") + 1;
    var filenameWithExtension = url.substr(index);
    return filenameWithExtension;
}

// Функция выполнения кода при загрузки приложения
function onLoad() {
	
    
}
// Функция исполнения когда приложение готово
function onDeviceReady() {
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
	ons.disableDeviceBackButtonHandler();
    document.addEventListener("backbutton", onBackKeyDown, false);
	
}
// Функция при нажатии кнопки НАЗАД
function onBackKeyDown() {
    if (openmodal == true) {
        console.log('Модальное закрывается');
        document.querySelector("#Modal_Config").hide();
        document.querySelector("#Modal_About").hide();
        document.querySelector("#Modal_Share").hide();
        openmodal = false;
    } else {
		
        console.log('Модальное было закрыто. останавливаем и закрываем все');
        
        ons.notification.confirm('Закрыть радио?').then(
            function(answer) {
                if (answer === 1) {
					$my_media.stop();
					OneclickPlay = 2;
                    console.log('закрывается');
					navigator.app.exitApp();
                }
            }
        );
    };
};
// Функция при сворачивании приложения
function onPause() {}
// Функция при восстановлении приложения
function onResume() {}
var openmodal = false;

function modals(name) {
    if (openmodal == false) {
        openmodal = true;
    } else {
        openmodal = false;
    };
    switch (name) {
        case "config":
            document.querySelector("#Modal_Config").toggle();
            break;
        case "about":
            document.querySelector("#Modal_About").toggle();
            break;
        case "share":
            document.querySelector("#Modal_Share").toggle();
            break;
    };
}
var streamChanel;
streamChanel = false;

function LoadConfigApp() {
    if (localStorage.ConfigApp) {
        Config(localStorage.ConfigApp);
    }
    jQuery.getJSON("http://app.radioradio.ru/api.php", function(data) {
		}).done(function(data) {
			if (localStorage.ConfigApp) {
				localStorage.setItem('ConfigApp', JSON.stringify(data));				
			} else {
				localStorage.setItem('ConfigApp', JSON.stringify(data));
				Config(localStorage.ConfigApp);
			};
            
        }).fail(function() {
            console.log("error");
        }).always(function() {
            console.log("complete");
        })
}

var ConfloadC = 0;
function Config(data) {
    data = JSON.parse(data);
    streamChanel = data.stream;
    if (jQuery.isEmptyObject(data.poll)) {
        jQuery('#poll').hide();
    } else {
        jQuery('#poll .poll_text').text(data.poll.text);
        jQuery('#poll .poll_ex').html('');
        jQuery.each(data.poll.ex, function(index, value) {
            jQuery('#poll .poll_ex').append('<div class="hor_grid_box"><a onclick="SmsSend(\'' + data.poll.pref + ' ' + (index + 1) + '\', \'' + data.poll.phone + '\')" href="#"><ons-button>' + value + '</ons-button></a></div>')
        });
        jQuery('#poll').show();
    };

    if (jQuery.isEmptyObject(data.conf.ads)) {
        jQuery('#ads').hide();
    } else {
        jQuery('#ads .logoAds a').attr('href', data.conf.ads.url);
        jQuery('#ads .logoAds a').css('background-image', 'url(http://app.radioradio.ru/partner/' + data.conf.ads.img + ')');
        jQuery('#ads').show();
    };
    if (jQuery.isEmptyObject(data.conf.sms)) {
        jQuery('.buttonSMS').hide();
    } else {
        jQuery('.smsact').attr('href', data.conf.sms);
        jQuery('.buttonSMS').show();
    };
    if (jQuery.isEmptyObject(data.conf.phone)) {
        jQuery('.buttonCall').hide();
    } else {
        jQuery('.phoneact').attr('href', data.conf.phone);
        jQuery('.buttonCall').show();
    };
	if(ConfloadC == 0){
		if (streamChanel != false) {
			$(".l3sAnim").css("background-color", "rgba(51,177,255,0.7)");
			$(".l3s").css("background-image", "url(img/play-l3-play.png)");
			$("#l2sOffAnim").fadeOut(750);
		};
		ConfloadC++; 
	}
}

// Тянем информацию об альбоме
function infoAlbum(type, id, md, artist, song) {
    var api = '88571316d4e244f24172ea9a9bf602fe';
    jQuery.ajax({
        url: "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=" + artist + "&album=" + song + "&api_key=" + api,
        type: "GET",
        dataType: "xml",
        success: function(xml) {
            jQuery(xml).find('album').each(function() {
                jQuery(this).find('image').each(function() {
                    var img = jQuery(this).attr('size');
                    if (img == "small") {
                        if (jQuery(this).text()) {
                            $himg = jQuery(this).text();
                            localStorage.setItem(md + 'Small', $himg);
                        }
                    };
                    if (img == "medium") {
                        if (jQuery(this).text()) {
                            $himg = jQuery(this).text();
                            localStorage.setItem(md + 'Medium', $himg);
                        }
                    };
                    if (img == "large") {
                        if (jQuery(this).text()) {
                            $himg = jQuery(this).text();
                            localStorage.setItem(md + 'Large', $himg);
                        }
                    };
                    if (img == "extralarge") {
                        if (jQuery(this).text()) {
                            $himg = jQuery(this).text();

                            localStorage.setItem(md + 'Extralarge', $himg);
                        }
                    }
                    if (img == "mega") {
                        if (jQuery(this).text()) {
                            $himg = jQuery(this).text();
                            localStorage.setItem(md + 'Mega', $himg);
                        } else {
                            infoArtist(type, id, md, artist, song);
                        }
                    }
                })
            });

            var ImgCashSmall = ContentSync.sync({
                src: localStorage.TrackIdNowImgSmall,
                id: 'small/' + getPageName(localStorage.TrackIdNowImgSmall),
                type: 'local'
            });
            var ImgCashMedium = ContentSync.sync({
                src: localStorage.TrackIdNowImgMedium,
                id: 'medium/' + getPageName(localStorage.TrackIdNowImgMedium),
                type: 'local'
            });
            var ImgCashLarge = ContentSync.sync({
                src: localStorage.TrackIdNowImgLarge,
                id: 'large/' + getPageName(localStorage.TrackIdNowImgLarge),
                type: 'local'
            });
            var ImgCashExtralarge = ContentSync.sync({
                src: localStorage.TrackIdNowImgExtralarge,
                id: 'extralarge/' + getPageName(localStorage.TrackIdNowImgExtralarge),
                type: 'local'
            });
            var ImgCashMega = ContentSync.sync({
                src: localStorage.TrackIdNowImgMega,
                id: 'mega/' + getPageName(localStorage.TrackIdNowImgMega),
                type: 'local'
            });

            ImgCashSmall.on('complete', function(data) {
                console.log(data.localPath);
                console.log(data.cached);
            });
            ImgCashMedium.on('complete', function(data) {
                console.log(data.localPath);
                console.log(data.cached);
            });
            ImgCashLarge.on('complete', function(data) {
				console.log('Ларге - отправим в бар');
                console.log(data.localPath);
                console.log(data.cached);
				ContentSync.loadUrl('file://' + data.localPath, function() {
					if (data.localPath) {
						statusBar(data.localPath);
						console.log('Ларге - отправили в бар Готово');
					}
				});
                
            });
            ImgCashExtralarge.on('complete', function(data) {
                console.log(data.localPath);
                console.log(data.cached);
                if (data.localPath) {
					console.log(data.localPath);
                }

            });
            ImgCashMega.on('complete', function(data) {
                console.log(data.localPath);
                console.log(data.cached);
            });

        },
        statusCode: {
            400: function() {
                infoArtist(type, id, md, artist, song);
				statusBar('icon.png');
            }
        }
    });
}
// Тянем информацию об артисте 
function infoArtist(type, id, md, artist, song) {
    var api = '88571316d4e244f24172ea9a9bf602fe';
    jQuery.ajax({
        url: "http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=" + artist + "&api_key=" + api,
        type: "GET",
        dataType: "xml",
        success: function(xml) {
            jQuery(xml).find('artist').each(function() {
                jQuery(this).find('image').each(function() {
                    var img = jQuery(this).attr('size');
                    if (img == "small") {
                        if (jQuery(this).text()) {
                            $himg = jQuery(this).text();
                            localStorage.setItem(md + 'Small', $himg);
                        }
                    };
                    if (img == "medium") {
                        if (jQuery(this).text()) {
                            $himg = jQuery(this).text();
                            localStorage.setItem(md + 'Medium', $himg);
                        }
                    };
                    if (img == "large") {
                        if (jQuery(this).text()) {
                            $himg = jQuery(this).text();
                            localStorage.setItem(md + 'Large', $himg);
                        };
                    };
                    if (img == "extralarge") {
                        if (jQuery(this).text()) {
                            $himg = jQuery(this).text();
                            localStorage.setItem(md + 'Extralarge', $himg);
                        }
                    }
                    if (img == "mega") {
                        if (jQuery(this).text()) {
                            $himg = jQuery(this).text();
                            localStorage.setItem(md + 'Mega', $himg);
                        }
                    }
                })
            });

            var ImgCashSmall = ContentSync.sync({
                src: localStorage.TrackIdNowImgSmall,
                id: 'small/' + getPageName(localStorage.TrackIdNowImgSmall),
                type: 'local'
            });
            var ImgCashMedium = ContentSync.sync({
                src: localStorage.TrackIdNowImgMedium,
                id: 'medium/' + getPageName(localStorage.TrackIdNowImgMedium),
                type: 'local'
            });
            var ImgCashLarge = ContentSync.sync({
                src: localStorage.TrackIdNowImgLarge,
                id: 'large/' + getPageName(localStorage.TrackIdNowImgLarge),
                type: 'local'
            });
            var ImgCashExtralarge = ContentSync.sync({
                src: localStorage.TrackIdNowImgExtralarge,
                id: 'extralarge/' + getPageName(localStorage.TrackIdNowImgExtralarge),
                type: 'local'
            });
            var ImgCashMega = ContentSync.sync({
                src: localStorage.TrackIdNowImgMega,
                id: 'mega/' + getPageName(localStorage.TrackIdNowImgMega),
                type: 'local'
            });

            ImgCashSmall.on('complete', function(data) {
                console.log(data.localPath);
                console.log(data.cached);
            });
            ImgCashMedium.on('complete', function(data) {
                console.log(data.localPath);
                console.log(data.cached);

            });
            ImgCashLarge.on('complete', function(data) {
				console.log('Ларге - отправим в бар');
                console.log(data.localPath);
                console.log(data.cached);
				ContentSync.loadUrl('file://' + data.localPath, function() {
					if (data.localPath) {
						statusBar(data.localPath);
						console.log('Ларге - отправили в бар Готово');
					}
				});
                
            });
            ImgCashExtralarge.on('complete', function(data) {
                console.log(data.localPath);
                console.log(data.cached);
            });
            ImgCashMega.on('complete', function(data) {
                console.log(data.localPath);
                console.log(data.cached);
            });
        },
        statusCode: {
            400: function() {
				statusBar('icon.png'); 				
			}
        }
    });
}

// Загружаем статус эфира
function LoadStatus() {
    jQuery.getJSON("http://app.radioradio.ru/json.php?i=i", function(data) {
        UpdateStatus(data.i);
    });
}


// Устанавливаем первоначальное значение куки о треке
localStorage.setItem('TrackIdNow', '');

// Каждые 15 секунд запрашиваем статус эфира
setInterval(function() {
    LoadStatus();
    $('#trace').html(window.location.pathname + ' ' + localStorage.TrackIdNow);
}, 15000);
// Обновляем статус эфира
function UpdateStatus(now) {
    if (localStorage.TrackIdNow == now) {} else {
        jQuery.getJSON("http://app.radioradio.ru/json.php?i=l", function(data) {
            setTimeout(function() {
                jQuery("#playinfo").addClass("show");
                // название трека
                jQuery('.songinfo').text(data.s);
                jQuery('.song').text(data.s);
                // артист
                jQuery('.titleinfo').text(data.a);
                jQuery('.artist').text(data.a);
                // Обновляет куки
                localStorage.setItem('NowSong', data.s);
                localStorage.setItem('NowArtist', data.a);
            }, 2000);
            localStorage.setItem('TrackIdNow', data.id);
            if (localStorage.getItem('ConfloadAlbum') == 'false') {
				  infoAlbum('playinfo', 'playinfoimg', 'TrackIdNowImg', data.a, data.s);
            } else {               
				console.log('Загрузка изображений альбома отключена.');
                statusBar('icon.png');        
            };
        });
    } 
}

// Статус, играет или нет.
var Playing = false;
// Вывод статус бара в шторку с инфой трека и обложкой
function statusBar(img) {
    if (streamer == "1") {
        Playing = false;
    } else {
        Playing = true;
    };
    if (localStorage.getItem('ConfloadAlbum') == 'false') {
		
	} else {
        img = 'icon.png';
    };
    MusicControls.create({
        track: localStorage.NowSong,
        artist: localStorage.NowArtist,
        cover: img,
        isPlaying: Playing,

        dismissable: true,
        hasPrev: false,
        hasNext: false,
        hasClose: false
    }, onSuccess, onError);
}

var onSuccess = function(result) {
    cancelled(result.completed = false)
}
var onError = function(msg) {}


// Шарим треки
function ShareTrack() {
    var textShare = 'Отличная музыка: ' + localStorage.NowSong + ' - ' + localStorage.NowArtist + '.\n Присоединяйся к RadioRadio!\n #радиорадио #музыка #онлайн';
    modals('share');
    if (localStorage.getItem('ConfloadAlbum') == 'false') {
        var files = localStorage.TrackIdNowImgMega;
    } else {
        var files = 'icon.png';
    };
    var ShareData = {
        message: textShare,
        subject: 'Мне нравится!',
        files: [files],
        url: 'http://radioradio.ru',
        chooserTitle: 'Поделись треком!'
    }
    var onSuccess = function(result) {
        modals('share');
    }
    var onError = function(msg) {
        console.log("Ошибка: " + msg);
        modals('share');
    }
    window.plugins.socialsharing.shareWithOptions(ShareData, onSuccess, onError);
}

function ShareRadioRadio() {
    var textShare = 'Присоединяйся к RadioRadio!\n https://vk.com/radioradioru \nhttps://www.facebook.com/radioradioru\n#радиорадио #музыка #онлайн';
    modals('share');
    var files = 'icon.png';
    var ShareData = {
        message: textShare,
        subject: 'Мне нравится!',
        files: [files],
        url: 'https://radioradio.ru/',
        chooserTitle: 'Поделись треком!'
    }
    var onSuccess = function(result) {
        modals('share');
    }
    var onError = function(msg) {
        console.log("Ошибка: " + msg);
        modals('share');
    }
    window.plugins.socialsharing.shareWithOptions(ShareData, onSuccess, onError);
}

function SmsSend(mess, phone) {
    ons.notification.confirm('Услуга платная').then(
        function(answer) {
            if (answer === 1) {
                var SmsData = {
                    phoneNumber: phone,
                    textMessage: mess
                };
                sms.sendMessage(SmsData, function(message) {
                    console.log("success: " + message);
                }, function(error) {
                    console.log("code: " + error.code + ", message: " + error.message);
                });
                ons.notification.alert('Сообщение успешно отправлено!');
            }
        }
    );

}


function checkConnection() {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = 'Неизвестный тип соединения';
    states[Connection.ETHERNET] = 'Соединение Ethernet';
    states[Connection.WIFI] = 'через Wi-fi';
    states[Connection.CELL_2G] = 'мобильный 2G';
    states[Connection.CELL_3G] = 'мобильный 3G';
    states[Connection.CELL_4G] = 'мобильный 4G';
    states[Connection.CELL] = 'мобильный, базовый';
    states[Connection.NONE] = 'нет соединения';
    return states[networkState];
}

var streamer = 1;
var OneclickPlay = 1;
var OneclickStop = 1;
// Функция кнопки ПЛЕЙ основной
function streamplay() {
    if (streamChanel == false) {
        alert('Пожалуйста подождите. Соединяемся с сервером.');
    } else if (checkConnection == 'нет соединения') {
        alert('Соединение с интернетом - отсутствует.');
    } else {
        OneclickPlay = 2;
        if (streamer == "1") {
            $my_media.play();
        } else if (streamer == "2") {
            $my_media.stop();
        } else if (streamer == "3") {
            $my_media.stop();
        } else if (streamer == "4") {
            $my_media.play();
        };
    }
}

function StreamGO() {
    var StreamGO;
    var StreamRegion = 'reg' + localStorage.getItem('StreamReg');
	if(streamChanel){
		 $.each(streamChanel, function(key, region) {
			// выбираем регион
			if (key == StreamRegion) {
				$.each(region, function(index, codec) {
					// выбираем кодек
					if (index == 'aac') {
						$.each(codec, function(index, qa) {
							$.each(qa, function(index, chanel) {
								StreamGO = chanel.patch;
								localStorage.setItem('Stream', StreamGO);
								console.log(StreamGO);
							})
						})
					};
				})
			};
		});
		return StreamGO;
	} else {
		return localStorage.Stream;
	}
   
};
// Функция восстановления воспроизведения
function streamRePlayGO() {
    setTimeout(function() {
        console.log("Восстанавливаем стрим");
        $("#l2sOffAnim").fadeIn(750);
        $my_media.play();
    }, 100);
};

function streamRePlay() {
    console.log(navigator.connection.type + ' ' + streamer + ' ' + OneclickStop + ' ' + OneclickPlay);
    if (navigator.connection.type != 'none' && streamer == "1" && OneclickStop == "2") {
        console.log('Сработали условия для перезапуска стрима!');
        streamRePlayGO();
    };
}

function LocalConfig() {
    if (localStorage.getItem('ConfloadAlbum') == 'false') {
    } else {
        $("#album").prop('checked', localStorage.getItem('ConfloadAlbum'));
    };
    if (localStorage.getItem('StreamQ')) {
        $("input[name='qa']").each(function() {
            if (this.value == localStorage.getItem('StreamQ')) {
                $(this).prop('checked', true)
            }
        });
    } else {
        localStorage.setItem('StreamQ', 'auto');
        $("input[name='qa']").each(function() {
            if (this.value == localStorage.getItem('StreamQ')) {
                $(this).prop('checked', true)
            }
        });
    };

    if (localStorage.getItem('StreamReg')) {
        localStorage.setItem('StreamReg', 'RU-MOS');
    } else {
        localStorage.setItem('StreamReg', 'RU-MOS');
    };
};
 function LoadStream() {
        setTimeout(function() {
            $my_media = new PlayStream(StreamGO(), function(status) {
                    console.log("status - " + status);
                    if (status === PlayStream.MEDIA_STOPPED) {
                        console.log('stopped');
                        MusicControls.updateIsPlaying(false);
                        streamer = 1; 
                        $(".l3sAnim").css("background-color", "rgba(51,177,255,0.7)");
                        $(".l3s").css("background-image", "url(img/play-l3-play.png)");
                        $("#l2sOffAnim").fadeOut(750);
                    }
                    if (status === PlayStream.MEDIA_STARTING) {
                        console.log('starting');
                        MusicControls.updateIsPlaying(true);
                        streamer = 2;
                        $(".l3sAnim").css("background-color", "rgba(255,87,34,1)");
                    }
                    if (status === PlayStream.MEDIA_RUNNING) {
                        console.log('running');
                        MusicControls.updateIsPlaying(true);
                        streamer = 3;
                        $(".l3sAnim").css("background-color", "rgba(51,177,255,1)");
                        $(".l3s").css("background-image", "url(img/play-l3-stop.png)");
                        $("#l2sOffAnim").fadeIn(750);
                    }
                },
                function(err) {
                    alert(err);
                }
            );
            var callmemabe = '1';
            PhoneCallTrap.onCall(function(state) {

                console.log("CHANGE STATE: " + state + " " + callmemabe);
                switch (state) {
                    case "RINGING":
                        console.log("Звонят");
                        if (streamer == "2") {
                            $("#l2sOffAnim").fadeOut(750);
                            $my_media.stop();
                            OneclickStop = 3;
                        } else if (streamer == "3") {
                            $("#l2sOffAnim").fadeOut(750);
                            $my_media.stop();
                            OneclickStop = 3;
                        }
                        callmemabe = '2';

                        break;
                    case "OFFHOOK":
                        console.log("Phone is off-hook");
                        if (streamer == "2") {
                            $("#l2sOffAnim").fadeOut(750);
                            $my_media.stop();
                            OneclickStop = 3;
                        } else if (streamer == "3") {
                            $("#l2sOffAnim").fadeOut(750);
                            $my_media.stop();
                            OneclickStop = 3;
                        }
                        callmemabe = '2';
                        break;

                    case "IDLE":
                        console.log("Телефон свободен: " + streamer + " " + callmemabe + " " + OneclickPlay);
                        if (streamer == "1" && callmemabe == '2' && OneclickPlay == "2") {
                            console.log("Восстанавливаем стрим через 3 секунды");
                            setTimeout(function() {
                                console.log("Восстанавливаем стрим");
                                $("#l2sOffAnim").fadeIn(750);
                                $my_media.play();
                                OneclickStop = 2;
                            }, 3000);
                        };
                        break;
                }
            });
            $my_media.stop();
        }, 2000);
    }
ons.ready(function() {
	
	setInterval(function() {
		LoadConfigApp();
	}, 60000);
    
   

    setInterval(function() {
        streamRePlay()
    }, 6000);
    // Sharing


    console.log('Приложение загружено');
    LocalConfig();

    $('input:checkbox').change(function() {
        var IdName = $(this).attr('id');
        if (IdName == 'album') {
            $(this).prop('checked')
            var ConfloadAlbum = $("#album").prop('checked');
            localStorage.setItem('ConfloadAlbum', ConfloadAlbum);
        };
    });
    $('input[name="qa"]').change(function() {
        $("input[name='qa']").each(function() {
            if (this.checked == true) {
                console.log(this.value);
                streamQ = this.value;
                localStorage.setItem('StreamQ', streamQ);
            }
        });
    });

    function events(action) {
        switch (action) {
            case 'music-controls-next':
                console.log('Следующая');
                break;
            case 'music-controls-previous':
                console.log('Предыдущая');
                break;
            case 'music-controls-pause':
                console.log('Пауза');
                OneclickPlay = 1;
                OneclickStop = 3;
                $my_media.stop();

                break;
            case 'music-controls-play':
                console.log('Плей');
                OneclickPlay = 2;
                OneclickStop = 2;
                $my_media.play();

                break;
            case 'music-controls-destroy':
                console.log('Удалено');
                OneclickPlay = 1;
                OneclickStop = 3;
                $my_media.stop();

                break;

                // Headset events (Android only)
            case 'music-controls-media-button':
                console.log('music-controls-media-button');
                break;
            case 'music-controls-headset-unplugged':
                console.log('unplugged');
                break;
            case 'music-controls-headset-plugged':
                console.log('plugged');
                break;
            default:
                break;
        }
    }
    MusicControls.subscribe(events);
    MusicControls.listen();



	function volumecurrent(){
		window.plugins.mediaVolume.getVol(
		  function(data){
			//data.current 当前音量
			//data.max 系统最大音量
			var cur = Math.floor((data.current * 100) / data.max);
			jQuery("#volume").val(cur)
		  },
		  function(error){
		});
	}
	volumecurrent();
	setInterval(function() {
        volumecurrent()
    }, 1200);
    jQuery("#volume").on('input', function() {
        var volume = jQuery("#volume").val();
        window.plugins.mediaVolume.setVol(volume);
        console.log(volume);
    });

    // скрыть плашку загрузки
    navigator.splashscreen.hide();
});

document.addEventListener("init", function(event) {
  if (event.target.id == "RadioRadio") {
		$("#l2sOffAnim").fadeOut(0).fadeIn(700).delay(500).fadeOut(300).fadeIn(700).delay(500).fadeOut(300);
		document.addEventListener("deviceready", onDeviceReady, false);
		LoadConfigApp();
		LoadStatus();
		LoadStream();
		if(typeof screen){
			screen.lockOrientation('portrait');
		};    
  }
}, false);