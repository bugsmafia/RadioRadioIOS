function StreamGO() {
	jQuery('#logs').append( timeLogs()+' - ������� StreamGO. �������� ����� ������<br/>');
    var StreamGO;
    var StreamRegion = 'reg' + localStorage.getItem('StreamReg');
	if(ons.platform.isAndroid() == true){
		return 'http://play.radioradio.ru/mp3?cash='+Date.now();
	} else {
		
	
		if(streamChanel){
			 $.each(streamChanel, function(key, region) {
				// �������� ������
				if (key == StreamRegion) {
					$.each(region, function(index, codec) {
						// �������� �����
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
			jQuery('#logs').append( timeLogs()+' - ������� StreamGO. '+StreamGO+'<br/>');
			return StreamGO+'?cash='+Date.now();
		} else {
			jQuery('#logs').append( timeLogs()+' - ������� StreamGO. '+localStorage.Stream+' �� ���������� ���������<br/>');
			return localStorage.Stream+'?cash='+Date.now();
		}
	}
   
};

function my_media(){
	jQuery('#logs').append( timeLogs()+' - ���������� � �������� ����� ������<br/>');
	$my_media = new Media(StreamGO(),
		function () {
			console.log("playAudio():Audio Success");
			jQuery('#logs').append( timeLogs()+' - ����� ������ - ������� ������������<br/>');
		},
		function (err) {
			jQuery('#logs').append( timeLogs()+' - ����� ������ - ���������� ������ '+JSON.stringify(err)+'<br/>');
			if(err == "1"){
				// ��������� ����� ���� ��������
				jQuery('#logs').append( timeLogs()+' - ����� ������ - 1. ����� �� 0, ������������� ������. ��������� ����� ���� ��������<br/>');
				streamer = "0";
				$(".l3s").css("background-image", "url(img/play2-play.png)");
				my_media();
			};
			if(err == "2"){
				// �������� � �������� �����������
				jQuery('#logs').append( timeLogs()+' - ����� ������ - 1. ����� �� 0, ������������� ������. �������� � �������� �����������<br/>');
				streamer = "0";
				$(".l3s").css("background-image", "url(img/play2-play.png)");
				my_media();
			};
			if(err == "3"){
				// ����� �� ��������������
				jQuery('#logs').append( timeLogs()+' - ����� ������ - 1. ����� �� 0, ������������� ������. ����� �� ��������������<br/>');
				streamer = "0";
				$(".l3s").css("background-image", "url(img/play2-play.png)");
				my_media();
				
			};
			if(err == "4"){
				// �� ��������������
				jQuery('#logs').append( timeLogs()+' - ����� ������ - 1. ����� �� 0, ������������� ������. �� ��������������<br/>');
				streamer = "0";
				$(".l3s").css("background-image", "url(img/play2-play.png)");
				my_media();
			};
		},
		function (mediaStatus) {
			console.log(mediaStatus);
			streamer = mediaStatus;
			jQuery('#logs').append( timeLogs()+' - ����� ������ - '+mediaStatus+'<br/>');
			if (streamer == "0") {
				// ������� �������. ������ ���
				$(".l3s").css("background-image", "url(img/play2-play.png)");
			} else if (streamer == "1"){
				// ����������� ������
				$(".l3s").css("background-image", "url(img/play2-stop.png)");
			} else if (streamer == "2") {
				// ����� �������
				$(".l3s").css("background-image", "url(img/play2-stop.png)");
			} else if (streamer == "3") {
				// �����
				$(".l3s").css("background-image", "url(img/play2-play.png)");
			} else if (streamer == "4") {
				// �����������
				$(".l3s").css("background-image", "url(img/play2-play.png)");
			};
		}
	);
};


var streamer = 0;
var OneclickPlay = 1;
var OneclickStop = 1;
// ������� ������ ���� ��������

function streamplay() {
	jQuery('#logs').append( timeLogs()+' - ������� streamplay<br/>');
    if (streamChanel == false) {
		jQuery('#logs').append( timeLogs()+' - ������ �������� �����������<br/>');
        alert('���������� ���������. ����������� � ��������.');
    } else if (checkConnection == '��� ����������') {
		jQuery('#logs').append( timeLogs()+' - �������� ���������� - �����������<br/>');
        alert('���������� � ���������� - �����������.');
    } else {
        OneclickPlay = 2;
		jQuery('#logs').append( timeLogs()+' - ������ streamer - '+streamer+'<br/>');
		if (streamer == "0") {
			jQuery('#logs').append( timeLogs()+' - ������ streamer - '+streamer+' play<br/>');
			$my_media.play();
		} else if (streamer == "1"){
			jQuery('#logs').append( timeLogs()+' - ������ streamer - '+streamer+' �����������<br/>');
			// ����������� ������		
		} else if (streamer == "2") {
			jQuery('#logs').append( timeLogs()+' - ������ streamer - '+streamer+' ����� �������. �������������<br/>');
			// ����� �������
			$my_media.release();
        } else if (streamer == "3") {
			jQuery('#logs').append( timeLogs()+' - ������ streamer - '+streamer+' ����� �� �����. ���������<br/>');
			// �����
			$my_media.play();
        } else if (streamer == "4") {
			jQuery('#logs').append( timeLogs()+' - ������ streamer - '+streamer+' ����� ���������� (��������). ����������� � ��������<br/>');
            // �����������
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




// ������� �������������� ���������������
function streamRePlayGO() {
	jQuery('#logs').append( timeLogs()+' - ������� �������������� ����������<br/>');
    setTimeout(function() {
        console.log("��������������� �����");
        $("#l2sOffAnim").fadeIn(750);
    }, 100);
};

function streamRePlay() {
	
    console.log(navigator.connection.type + ' ' + streamer + ' ' + OneclickStop + ' ' + OneclickPlay);
    if (navigator.connection.type != 'none' && streamer == "1" && OneclickStop == "2") {
        console.log('��������� ������� ��� ����������� ������!');
		jQuery('#logs').append( timeLogs()+' - ��������� ������� ��� ����������� ������!<br/>');
        streamRePlayGO();
    };
}

my_media();