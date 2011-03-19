Ext.setup({
	onReady: function() {
		Synesthesizer.setImage(Ext.get('image'));

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
					text: 'Play'
				},
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
			},{
				xtype: 'sliderfield',
				label: 'Segments',
				value: Synesthesizer.getSegments(),
				minValue: 10,
				maxValue: 30,
				animationDuration: 0,
				listeners: {
					scope: this,
					change: function(slider, thumb, newValue, oldValue) {
						Synesthesizer.setSegments(newValue);
					}
				}
			}],
		});
	}
});
