Ext.setup({
	onReady: function() {

		var panel = new Ext.Panel({
			fullscreen: true,
			dockedItems: [{
				dock : 'top',
				xtype: 'toolbar',
				title: 'Synesthesizer'
			},{
				dock : 'bottom',
				xtype: 'toolbar',
				ui   : 'dark',
				items: {
					text: 'Play',
					listeners: {
						tap: function() {
							Synesthesizer.playSequence();
						}
					}
				}
			}],
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: [{
				xtype: 'panel',
				id: 'imageView',
				title: 'test',
				borders: 10,
				flex: 1, 
				contentEl: 'synesthesizer',
				centered: true,
				listeners: {
					scope: this,
					afterlayout: function() {
						Synesthesizer.setImage(Ext.get('image'));
						Synesthesizer.setSegments(15);
						Synesthesizer.initAudio();
						Ext.getCmp('sliderField').labelEl.setHTML(Synesthesizer.getSegments() + ' Segments');
						Ext.getCmp('sliderField').addListener('change', function(slider, thumb, newValue, oldValue) {
							Synesthesizer.setSegments(newValue);
							slider.labelEl.setHTML(Synesthesizer.getSegments() +' Segments');
						});
					}
				}
			},{
				xtype: 'sliderfield',
				label: Synesthesizer.getSegments() +' Segments',
				value: 15,
				id: 'sliderField',
				minValue: 10,
				maxValue: 30,
				animationDuration: 0
			}],
		});
	}
});
