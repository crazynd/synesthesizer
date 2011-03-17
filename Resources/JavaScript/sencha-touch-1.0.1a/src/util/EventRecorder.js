// This class is still experimental, docs will be added at a later time
Ext.util.EventRecorder = Ext.extend(Ext.util.Observable, {

    eventCollection: null,

    currentEventSetName: null,

    constructor: function() {
        this.addEvents(
            'replaystart',
            'beforecalculatetarget',
            'beforefire',
            'afterfire',
            'aftercalculatetarget',
            'replayend',
            'interrupted'
        );

        this.eventSets = {};
        this.interruptedIndexes = {};

        return this;
    },

    getEventSet: function(name) {
        if (typeof name != 'string') {
            if (this.currentEventSetName == null)
                throw new Error('No EventSet is currently used');

            name = this.currentEventSetName;
        }

        if (typeof this.eventSets[name] == 'undefined') {
            this.eventSets[name] = [];
        }
        return this.eventSets[name];
    },

    start: function(name) {
        this.currentEventSetName = name;
    },

    record: function(name, event) {
        if (typeof name != 'string') {
            // Not being recorded since either it's not started or is already ended
            if (this.currentEventSetName == null)
                return;

            event = name;
            name = this.currentEventSetName;
        }

        var eventData = this.getEventSimulator().createEventData(event, true);

        this.getEventSet(name).push(eventData);
    },

    setEventSet: function(name, events) {
        this.eventSets[name] = events;
    },

    erase: function(name) {
        // Empty the array
        this.getEventSet(name).length = 0;
    },

    stopReplay: function() {
        this.interruptFlag = true;
    },

    resumeReplay: function(name) {
        var index = this.interruptedIndexes[name] || 0;
        this.replay(name, index);
    },

    replay: function(name, startIndex) {
        var simulator = this.getEventSimulator(),
            events = this.getEventSet(name),
            numEvents,
            delay = 0,
            index = 0,
            event,
            point,
            target,
            reserveTargetEvents = ['touchmove', 'touchend', 'mousemove', 'mouseup'],
            me = this;

        if (typeof startIndex == 'undefined') {
            startIndex = 0;
        }

        index = startIndex;
        
        numEvents = events.length;

        this.interruptFlag = false;

        if (numEvents > 0) {
            this.fireEvent('replaystart', name, startIndex);
            setTimeout(function() {
                event = events[index];
                
                if (event) {

                    if (reserveTargetEvents.indexOf(event.type) === -1) {
                        me.fireEvent('beforecalculatetarget', event.type, event);
                        point = Ext.util.Point.fromEvent(event);
                        target = document.elementFromPoint(point.x, point.y);
                        me.fireEvent('aftercalculatetarget', event.type, target, event);
                    }
                    
                    if (target) {
                        if (me.interruptFlag === true) {
                            me.interruptFlag = false;
                            me.interruptedIndexes[name] = index;
                            me.fireEvent('interrupted', index);
                            me.fireEvent('replayend', name, true);
                            return;
                        }
                        me.fireEvent('beforefire', event.type, target, event);
                        simulator.fire(event.type, target, event);
                        me.fireEvent('afterfire', event.type, target, event);
                    }

                    if (++index < numEvents) {
                        setTimeout(arguments.callee, events[index].timeStamp - event.timeStamp);
                    } else {
                        me.fireEvent('replayend', name, false);
                    }
                }
            }, delay);
        }
    },

    end: function() {
        this.currentEventSetName = null;
    },

    getEventSimulator: function() {
        if (!this._eventSimulator) {
            this._eventSimulator = new Ext.util.EventSimulator();
        }

        return this._eventSimulator;
    },

    setEventSimulator: function(eventSimulator) {
        if (!(eventSimulator instanceof Ext.util.EventSimulator))
            throw new Error('eventSimulator must be an instance of Ext.util.EventSimulator');

        this._eventSimulator = eventSimulator;
    },

    // TODO
    save: function(name) {

    }
});