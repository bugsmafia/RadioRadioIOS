
function timeLogs() {
	var now = new Date();
	var time = '['+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds()+'.'+now.getMilliseconds()+']';
	return time;
};

jQuery('#logs').append( timeLogs()+' - Загружен скрипт<br/>');


function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
function exit(){
	var thisWindow = window.open("index.html",'_self');
	thisWindow.close();
}

function Loader() {
	jQuery('#logs').append( timeLogs()+' - Начало закрытия окна загрузки<br/>');
	$(".La").fadeOut(700);
	$(".Lb").fadeOut(700);
	$(".Lc").fadeOut(700);
	setTimeout(function() {
		$(".preload").fadeOut(350);
	}, 2000);
	jQuery('#logs').append( timeLogs()+' - Окно загрузки закрыто<br/>');
};

$(document).on('pagechange', function() {
	jQuery('#logs').append( timeLogs()+' - pagechange ON<br/>');
    var lastPage = '#'+$.mobile.activePage.attr('id');
    console.log('setting last page to '+lastPage);
    localStorage.setItem('lastPage',lastPage);
});

var redirectedToLastPage = false;
$(document).bind("pagecreate", function(){
	jQuery('#logs').append( timeLogs()+' - pagecreate bind<br/>');
    var lastPage = localStorage.getItem('lastPage');
    if(lastPage // lastPage needs to be set
        && !redirectedToLastPage  // only do it on first pageload
        &&!window.location.hash // we don't want to redirect from pages other than the homepage
    ) {
        if($("div[data-role='page']"+lastPage).length) { // make sure a "page" div with that ID exists!
            console.log('redirecting to '+lastPage);
            $.mobile.changePage(lastPage);
        } 
        else {
        console.log(lastPage+' does not exist!');
        }
    }
    redirectedToLastPage = true;
});
function getPageName(url) {
    var index = url.lastIndexOf("/") + 1;
    var filenameWithExtension = url.substr(index);
    return filenameWithExtension;
}

// Функция выполнения кода при загрузки приложения
function onLoad() {    
	jQuery('#logs').append( timeLogs()+' - Приложение onLoad<br/>');
}
// Функция исполнения когда приложение готово
function onDeviceReady() {
	jQuery('#logs').append( timeLogs()+' - Приложение onDeviceReady<br/>');
	
	
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
	ons.disableDeviceBackButtonHandler();
    document.addEventListener("backbutton", onBackKeyDown, false);

	
}
// Функция при нажатии кнопки НАЗАД
function onBackKeyDown() {
	jQuery('#logs').append( timeLogs()+' - Кнопка НАЗАД<br/>');
    if (openmodal == true) {
        console.log('Модальное закрывается');
        document.querySelector("#Modal_Config").hide();
        document.querySelector("#Modal_About").hide();
        document.querySelector("#Modal_Share").hide();
		document.querySelector("#Modal_Debug").hide();
        openmodal = false;
		jQuery('#logs').append( timeLogs()+' - Закрыли все модальные окна<br/>');
    } else {
		jQuery('#logs').append( timeLogs()+' - Окно с закрытием приложения<br/>');
        console.log('Модальное было закрыто. останавливаем и закрываем все');        
        ons.notification.confirm('Закрыть радио?').then(
            function(answer) {
                if (answer === 1) {
					streamer = 1;
					$my_media.release();
					OneclickPlay = 2;
                    console.log('закрывается');
					navigator.app.exitApp();
                }
            }
        );
    };
};
// Функция при сворачивании приложения
function onPause() {
	jQuery('#logs').append( timeLogs()+' - Приложение свернулось, уходим врежим ожидания<br/>');
	
}
// Функция при восстановлении приложения
function onResume() {
	jQuery('#logs').append( timeLogs()+' - Приложение восстановилось из спящего режима<br/>');
	
}
var openmodal = false;

function modals(name) {
	
    if (openmodal == false) {
        openmodal = true;
    } else {
        openmodal = false;
    };
	//jQuery('#logs').append( timeLogs()+' - Открываем окно '+name+'<br/>');
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
		case "debug":
            document.querySelector("#Modal_Debug").toggle();
            break;
    };
}
var streamChanel;
streamChanel = false;

function LoadConfigApp() {
	jQuery('#logs').append( timeLogs()+' - Загружаем конфигурации приложения с сервера<br/>');
    if (localStorage.ConfigApp) {
		jQuery('#logs').append( timeLogs()+' - Конфигурации доступны из кеша, возьмем их<br/>');
        Config(localStorage.ConfigApp);
    }
    jQuery.getJSON("http://app.radioradio.ru/api.php", function(data) {
		}).done(function(data) {
			if (localStorage.ConfigApp) {
				jQuery('#logs').append( timeLogs()+' - Сохраним конфигурации в локальное хранилище<br/>');
				localStorage.setItem('ConfigApp', JSON.stringify(data));				
			} else {
				jQuery('#logs').append( timeLogs()+' - В локальном хранилище отсутствуют конфигурации. Создадим его и сохраним<br/>');
				localStorage.setItem('ConfigApp', JSON.stringify(data));
				Config(localStorage.ConfigApp);
			};
            
        }).fail(function() {
			jQuery('#logs').append( timeLogs()+' - Ошибка загрузки конфигурации с сервера<br/>');
            console.log("error");
        }).always(function() {
			jQuery('#logs').append( timeLogs()+' - Конфигурации с сервера загружены успешно<br/>');
            console.log("complete");
        })
}

var ConfloadC = 0;
function SmsSend(text, phone){
	jQuery('#logs').append( timeLogs()+' - Функция отправки СМС<br/>');
	ons.notification.confirm('Для участия в опросе, отправь СМС c текстом <'+text+'> на короткий номер '+phone+'').then(
            function(answer) {
                if (answer === 1) {
					window.location = "sms:"+phone+"?body="+text+"";
                }
            }
        );
	
}

function Config(data) {
	jQuery('#logs').append( timeLogs()+' - Обрабатываем конфигурацию приложения<br/>');
    data = JSON.parse(data);
    streamChanel = data.stream;
    if (jQuery.isEmptyObject(data.poll)) {
		jQuery('#logs').append( timeLogs()+' - Активного опроса нет. Скроем его<br/>');
        jQuery('#poll').hide();
    } else {
		jQuery('#logs').append( timeLogs()+' - Есть активный опрос, подготавливаем вывод<br/>');
        jQuery('#poll .poll_text').text(data.poll.text);
        jQuery('#poll .poll_ex').html('');
        jQuery.each(data.poll.ex, function(index, value) {
            jQuery('#poll .poll_ex').append('<div class="hor_grid_box"><a onclick="SmsSend(\'' + data.poll.pref + ' ' + (index + 1) + '\', \'' + data.poll.phone + '\')" href="#"><ons-button>' + value + '</ons-button></a></div>')
        });
        jQuery('#poll').show();
		jQuery('#logs').append( timeLogs()+' - Вывели активный опрос<br/>');
    };

    if (jQuery.isEmptyObject(data.conf.ads)) {
        //jQuery('#ads').hide();
		jQuery('#logs').append( timeLogs()+' - Рекламная компания отсутствует. Скрыли<br/>');
    } else {
        jQuery('#ads .logoAds a').attr('href', data.conf.ads.url);
        jQuery('#ads .logoAds a').css('background-image', 'url(http://app.radioradio.ru/partner/' + data.conf.ads.img + ')');
       // jQuery('#ads').show();
	   jQuery('#logs').append( timeLogs()+' - Выводим рекламный блок партнера<br/>');
    };
    if (jQuery.isEmptyObject(data.conf.sms)) {
		jQuery('#logs').append( timeLogs()+' - Функция СМС отключена<br/>');
        jQuery('.buttonSMS').hide();
    } else {
		jQuery('#logs').append( timeLogs()+' - Функция СМС включена<br/>');
        jQuery('.smsact').attr('href', 'sms://'+data.conf.sms);
        jQuery('.buttonSMS').show();
    };
    if (jQuery.isEmptyObject(data.conf.phone)) {
		jQuery('#logs').append( timeLogs()+' - Кнопка зконка в студию - Не активна<br/>');
        jQuery('.buttonCall').hide();
    } else {
		jQuery('#logs').append( timeLogs()+' - Кнопка зконка в студию - Активна<br/>');
        jQuery('.phoneact').attr('href', data.conf.phone);
        jQuery('.buttonCall').show();
    };
	if(ConfloadC == 0){
		jQuery('#logs').append( timeLogs()+' - ConfloadC == 0<br/>');
		if (streamChanel != false) {
			$(".l3sAnim").css("background-color", "rgba(51,177,255,0.7)");
			$(".l3s").css("background-image", "url(img/play2-play.png)");
			$("#l2sOffAnim").fadeOut(750);
		};
		ConfloadC++; 
	}
}

// Устанавливаем первоначальное значение куки о треке
localStorage.setItem('TrackIdNow', '');

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
	
	/*
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
	*/
}

var onSuccess = function(result) {
	jQuery('#logs').append( timeLogs()+' - onSuccess<br/>');
    cancelled(result.completed = false)
}
var onError = function(msg) {
	jQuery('#logs').append( timeLogs()+' - onError<br/>');
}

function LogoRadioRadio() {
	jQuery('#logs').append( timeLogs()+' - Перейти на веб версию проекта?<br/>');
    ons.notification.confirm('Перейти на веб версию RadioRadio.ru?').then(
        function(answer) {
            if (answer === 1) {
				var ref = cordova.InAppBrowser.open('http://radioradio.ru', '_blank', 'location=yes');
				window.open = cordova.InAppBrowser.open;
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
	jQuery('#logs').append( timeLogs()+' - Тип соединения '+states[networkState]+'<br/>');
    return states[networkState];
}

	



var streamer = 0;
var OneclickPlay = 1;
var OneclickStop = 1;
// Функция кнопки ПЛЕЙ основной

function streamplay() {
	jQuery('#logs').append( timeLogs()+' - Функция streamplay<br/>');
    if (streamChanel == false) {
		jQuery('#logs').append( timeLogs()+' - Каналы серверов отсутствуют<br/>');
        alert('Пожалуйста подождите. Соединяемся с сервером.');
    } else if (checkConnection == 'нет соединения') {
		jQuery('#logs').append( timeLogs()+' - Интернет соединение - отсутствует<br/>');
        alert('Соединение с интернетом - отсутствует.');
    } else {
        OneclickPlay = 2;
		jQuery('#logs').append( timeLogs()+' - Статус streamer - '+streamer+'<br/>');
		if (streamer == "0") {
			jQuery('#logs').append( timeLogs()+' - Статус streamer - '+streamer+' play<br/>');
			$my_media.play();
		} else if (streamer == "1"){
			jQuery('#logs').append( timeLogs()+' - Статус streamer - '+streamer+' буферизация<br/>');
			// буферизация потока		
		} else if (streamer == "2") {
			jQuery('#logs').append( timeLogs()+' - Статус streamer - '+streamer+' поток запущен. Останавливаем<br/>');
			// Поток запущен
			$my_media.release();
        } else if (streamer == "3") {
			jQuery('#logs').append( timeLogs()+' - Статус streamer - '+streamer+' поток на паузе. Запускаем<br/>');
			// Пауза
			$my_media.play();
        } else if (streamer == "4") {
			jQuery('#logs').append( timeLogs()+' - Статус streamer - '+streamer+' поток остановлен (завершен). Пересоздаем и включаем<br/>');
            // Остановлено
			$my_media.release();
			streamer == "0"

			my_media();

			setTimeout(function() {
				$my_media.play();
			}, 500);
			
			//$my_media.play();
        };
    }
}

function StreamGO() {
	jQuery('#logs').append( timeLogs()+' - Функция StreamGO. Запросим адрес потока<br/>');
    var StreamGO;
    var StreamRegion = 'reg' + localStorage.getItem('StreamReg');
	if(ons.platform.isAndroid() == true){
		return 'http://play.radioradio.ru/mp3?cash='+Date.now();
	} else {
		
	
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
			jQuery('#logs').append( timeLogs()+' - Функция StreamGO. '+StreamGO+'<br/>');
			return StreamGO+'?cash='+Date.now();
		} else {
			jQuery('#logs').append( timeLogs()+' - Функция StreamGO. '+localStorage.Stream+' из калольного хранилища<br/>');
			return localStorage.Stream+'?cash='+Date.now();
		}
	}
   
};


// Функция восстановления воспроизведения
function streamRePlayGO() {
	jQuery('#logs').append( timeLogs()+' - Функция восстановления трансляции<br/>');
    setTimeout(function() {
        console.log("Восстанавливаем стрим");
        $("#l2sOffAnim").fadeIn(750);
    }, 100);
};

function streamRePlay() {
	
    console.log(navigator.connection.type + ' ' + streamer + ' ' + OneclickStop + ' ' + OneclickPlay);
    if (navigator.connection.type != 'none' && streamer == "1" && OneclickStop == "2") {
        console.log('Сработали условия для перезапуска стрима!');
		jQuery('#logs').append( timeLogs()+' - Сработали условия для перезапуска стрима!<br/>');
        streamRePlayGO();
    };
}

function LocalConfig() {
	jQuery('#logs').append( timeLogs()+' - Загрузка конфигураций<br/>');
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
}
ons.ready(function() {
	jQuery('#logs').append( timeLogs()+' - Фреймворк готов<br/>');
	setInterval(function() {
		jQuery('#logs').append( timeLogs()+' - Запрашиваем циклом конфигурации приложения<br/>');
		LoadConfigApp();
	}, 60000);
    
   

    setInterval(function() {
        streamRePlay()
    }, 6000);
    // Sharing


    console.log('Приложение загружено');
    LocalConfig();

		if(typeof screen){
			screen.lockOrientation('portrait');
		};
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


                break;
            case 'music-controls-play':
				jQuery('#logs').append( timeLogs()+' - Из шторки Плей<br/>');
                console.log('Плей');
                OneclickPlay = 2;
                OneclickStop = 2;


                break;
            case 'music-controls-destroy':
				jQuery('#logs').append( timeLogs()+' - Из шторки Удалено<br/>');
                console.log('Удалено');
                OneclickPlay = 1;
                OneclickStop = 3;


                break;

                // Headset events (Android only)
            case 'music-controls-media-button':
                console.log('music-controls-media-button');
                break;
            case 'music-controls-headset-unplugged':
				jQuery('#logs').append( timeLogs()+' - Из шторки unplugged<br/>');
                console.log('unplugged');
                break;
            case 'music-controls-headset-plugged':
				jQuery('#logs').append( timeLogs()+' - Из шторки plugged<br/>');
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
		$my_media.setVolume(volume);
        console.log(volume);
    });
	
    // скрыть плашку загрузки
    //navigator.splashscreen.hide(); 
});

document.addEventListener("init", function(event) {
	jQuery('#logs').append( timeLogs()+' - Инициализация кода<br/>');
  if (event.target.id == "RadioRadio") {
		jQuery('#logs').append( timeLogs()+' - Инициализация RadioRadio<br/>');
		document.addEventListener("deviceready", onDeviceReady, false);
		LoadConfigApp();
		LoadStatus();
		LoadStream();
		Loader();
		$('.playbtn').width($('body').width());
		$('.playbtn').height($('body').width());
		$('.buttonSMS').css('bottom', (($('.boxmain').height() * 0.370) + ($('.buttonCall').height() / 2)+'px'));
		$('.buttonCall').css('bottom', (($('.boxmain').height() * 0.370) + ($('.buttonCall').height() / 2)+'px'));
		
		
		
  }
}, false);
var stpl = 0;

function statPlay(){
	stpl = 0;
	/*
	navigator.RADIO.update(function(a) {
		if(a == 'Играет'){
			stpl = 1;
		} else {
			stpl = 0;
		}
	});
	*/
	return stpl;
}

function stat(){
	$.post("http://app.radioradio.ru/stat.php", {
		cordova: device.cordova,
		model: device.model,
		platform: device.platform,
		uuid: device.uuid,
		version: device.version,
		manufacturer: device.manufacturer,
		isVirtual: device.isVirtual,
		serial: device.serial,
		play: statPlay()
	}).done(function(data, statusText, xhr){
	if(xhr.status == 200){
			// Все отлично
		} else {
			// Все отлично
		};
	});
}

document.addEventListener('deviceready', function () {
	if(localStorage.getItem('bg') == 1){
		setTimeout(function() {
			localStorage.setItem('bg', '0');
			navigator.app.exitApp();
		}, 500);
	}
    //cordova.plugins.backgroundMode.enable();
	cordova.plugins.backgroundMode.setDefaults({
		title:  'Радиостанция',
		ticker: 'Радио',
		text:   'Радио',
		resume: true,
		isPublic: true
	});
	cordova.plugins.backgroundMode.onactivate = function() {
		localStorage.setItem('bg', '1');
		setTimeout(function () {
            // Modify the currently displayed notification
            cordova.plugins.backgroundMode.configure({
				title: localStorage.getItem('NowSong'),
                text: localStorage.getItem('NowArtist')
            });
        }, 5000);
	};
	cordova.plugins.backgroundMode.ondeactivate = function() {
		localStorage.setItem('bg', '0');
	};
	
	
	
// StreamGO()

//playAudio(StreamGO())
function my_media(){
	jQuery('#logs').append( timeLogs()+' - Подготовка к созданию МЕДИА задачи<br/>');
	$my_media = new Media(StreamGO(),
		function () {
			console.log("playAudio():Audio Success");
			jQuery('#logs').append( timeLogs()+' - Медиа задача - успешна подготовлена<br/>');
		},
		function (err) {
			jQuery('#logs').append( timeLogs()+' - Медиа задача - получилась ошибку '+JSON.stringify(err)+'<br/>');
			if(err == "1"){
				// Получение медиа было прервано
				jQuery('#logs').append( timeLogs()+' - Медиа задача - 1. Стрим на 0, перезапускаем задачу. Получение медиа было прервано<br/>');
				streamer = "0";
				$(".l3s").css("background-image", "url(img/play2-play.png)");
				my_media();
			};
			if(err == "2"){
				// Проблемы с интернет соединением
				jQuery('#logs').append( timeLogs()+' - Медиа задача - 1. Стрим на 0, перезапускаем задачу. Проблемы с интернет соединением<br/>');
				streamer = "0";
				$(".l3s").css("background-image", "url(img/play2-play.png)");
				my_media();
			};
			if(err == "3"){
				// Кодек не поддерживается
				jQuery('#logs').append( timeLogs()+' - Медиа задача - 1. Стрим на 0, перезапускаем задачу. Кодек не поддерживается<br/>');
				streamer = "0";
				$(".l3s").css("background-image", "url(img/play2-play.png)");
				my_media();
				
			};
			if(err == "4"){
				// Не поддерживается
				jQuery('#logs').append( timeLogs()+' - Медиа задача - 1. Стрим на 0, перезапускаем задачу. Не поддерживается<br/>');
				streamer = "0";
				$(".l3s").css("background-image", "url(img/play2-play.png)");
				my_media();
			};
		},
		function (mediaStatus) {
			console.log(mediaStatus);
			streamer = mediaStatus;
			jQuery('#logs').append( timeLogs()+' - Медиа статус - '+mediaStatus+'<br/>');
			if (streamer == "0") {
				// Нулевая позиция. ничего нет
				$(".l3s").css("background-image", "url(img/play2-play.png)");
			} else if (streamer == "1"){
				// буферизация потока
				$(".l3s").css("background-image", "url(img/play2-stop.png)");
			} else if (streamer == "2") {
				// Поток запущен
				$(".l3s").css("background-image", "url(img/play2-stop.png)");
			} else if (streamer == "3") {
				// Пауза
				$(".l3s").css("background-image", "url(img/play2-play.png)");
			} else if (streamer == "4") {
				// Остановлено
				$(".l3s").css("background-image", "url(img/play2-play.png)");
			};
		}
	);
};
my_media();
var successCallback = function(result) {  
	jQuery('#logs').append( timeLogs()+' - audio callback - '+ JSON.stringify(result)+'<br/>');
  console.log('audio callback ' + JSON.stringify(result));  
  if (result.type==='progress') {  
    console.log('progress/duration/available - ' + result.progress + '/' + result.duration + '/' + result.available); // available not currently supported  
  } else if (result.type==='state') {  
    console.log('status - ' + result.state + '/' + result.description);  
  } else if (result.type==='error') {  
    console.log('error - ' + result.reason);  
  } else if (result.type==='current') {  
    console.log('current audio ' + JSON.stringify(result.audio));  
  } else if (result.type==='next') {  
    console.log('skip to next audio track'); // typically fired by remote control/lock screen controls  
  } else if (result.type==='previous') {  
    console.log('skip to previous track'); // typically fired by remote/control/lock screen controls
  } else {  
    console.log('AudioCallback unhandled type (' + result.type + ')');  
  }  
};  
	
	
	
	setInterval(function() {
	window.plugins.webintent.getUri(function(url) {
		if(url !== "") {
			// url is the url the intent was launched with
		}
	});
	window.plugins.webintent.onNewIntent(function(url) {
		if(url !== "") {
			// url is the url that was passed to onNewIntent
		}
	});
	}, 1000);
	cordova.plugins.backgroundMode.enable();
	stat();
	setInterval(function() {
		stat();
	}, 15000);
}, false);
function exit(){
	var thisWindow = window.open("index.html",'_self');
	thisWindow.close();
}