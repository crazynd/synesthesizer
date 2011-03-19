Ext.setup({
onReady: function() {

	var pnl = new Ext.Panel({
	    fullscreen: true,
	    items: [
	        {
	            xtype: 'audio',
	            url  : "Resources/sounds/A.mp3"
	        },
	        {
	            xtype: 'audio',
	            url  : "Resources/sounds/C.mp3"
	        },
	        {
	            xtype: 'audio',
	            url  : "Resources/sounds/E.mp3"
	        },	    
	        {
	            xtype: 'audio',
	            url  : "Resources/sounds/F.mp3"
	        },
	        {
	            xtype: 'audio',
	            url  : "Resources/sounds/H.mp3",
	        }
	        ]
	      
	})
		
	var sequence = [];
	sequence[0] = 0;
	sequence[1] = 1;
	sequence[2] = 0;
	sequence[3] = 3;
	sequence[4] = 4;
	sequence[5] = 1;
		
	var playNext = function() {
		sequence.shift();
		if(sequence.length != 0) {
		 	var itemNoToPlay = parseInt(sequence[0]); 
		 	pnl.items.items[itemNoToPlay].play();
		 }
	}
	
	var sounds = [];
	sounds = document.getElementsByTagName("audio");
	for(var i = 0; i < sounds.length; i++) {
		sounds[i].addEventListener('ended', playNext);
	}

	var firstSound = parseInt(sequence[0]); 
	sounds[firstSound].play();
}

});