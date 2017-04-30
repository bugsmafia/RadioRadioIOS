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

my_media();