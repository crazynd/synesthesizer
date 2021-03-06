/**
 * @class Ext.util.Sortable
 * @extends Ext.util.Observable
 * @constructor
 * @param {Mixed} el
 * @param {Object} config
 */
Ext.util.Sortable = Ext.extend(Ext.util.Observable, {
    baseCls: 'x-sortable',

    /**
     * @cfg {String} direction
     * Possible values: 'vertical', 'horizontal'
     * Defaults to 'vertical'
     */
    direction: 'vertical',

    /**
     * @cfg {String} cancelSelector
     * A simple CSS selector that represents elements within the draggable
     * that should NOT initiate a drag.
     */
    cancelSelector: null,

    // not yet implemented
    //indicator: true,
    //proxy: true,
    //tolerance: null,

    /**
     * @cfg {Element/Boolean} constrain
     * An Element to constrain the Sortable dragging to. Defaults to <tt>window</tt>.
     * If <tt>true</tt> is specified, the dragging will be constrained to the element
     * of the sortable.
     */
    constrain: window,
    /**
     * @cfg {String} group
     * Draggable and Droppable objects can participate in a group which are
     * capable of interacting. Defaults to 'base'
     */
    group: 'base',

    /**
     * @cfg {Boolean} revert
     * This should NOT be changed.
     * @private
     */
    revert: true,

    /**
     * @cfg {String} itemSelector
     * A simple CSS selector that represents individual items within the Sortable.
     */
    itemSelector: null,

    /**
     * @cfg {String} handleSelector
     * A simple CSS selector to indicate what is the handle to drag the Sortable.
     */
    handleSelector: null,

    /**
     * @cfg {Boolean} disabled
     * Passing in true will disable this Sortable.
     */
    disabled: false,

    /**
     * @cfg {Number} delay
     * How many milliseconds a user must hold the draggable before starting a
     * drag operation. Defaults to 0 or immediate.
     * @private
     */
    delay: 0,

    // Properties

    /**
     * Read-only property that indicates whether a Sortable is currently sorting.
     * @type Boolean
     * @private
     */
    sorting: false,

    /**
     * Read-only value representing whether the Draggable can be moved vertically.
     * This is automatically calculated by Draggable by the direction configuration.
     * @type Boolean
     * @private
     */
    vertical: false,

    /**
     * Read-only value representing whether the Draggable can be moved horizontally.
     * This is automatically calculated by Draggable by the direction configuration.
     * @type Boolean
     * @private
     */
    vertical: false,
    
    constructor : function(el, config) {
        config = config || {};
        Ext.apply(this, config);

        this.addEvents(
            /**
             * @event sortstart
             * @param {Ext.Sortable} this
             * @param {Ext.EventObject} e
             */
            'sortstart',
            /**
             * @event sortend
             * @param {Ext.Sortable} this
             * @param {Ext.EventObject} e
             */
            'sortend',
            /**
             * @event sortchange
             * @param {Ext.Sortable} this
             * @param {Ext.Element} el The Element being dragged.
             * @param {Number} index The index of the element after the sort change.
             */
            'sortchange'

            // not yet implemented.
            // 'sortupdate',
            // 'sortreceive',
            // 'sortremove',
            // 'sortenter',
            // 'sortleave',
            // 'sortactivate',
            // 'sortdeactivate'
        );

        this.el = Ext.get(el);
        Ext.util.Sortable.superclass.constructor.call(this);

        if (this.direction == 'horizontal') {
            this.horizontal = true;
        }
        else if (this.direction == 'vertical') {
            this.vertical = true;
        }
        else {
            this.horizontal = this.vertical = true;
        }

        this.el.addCls(this.baseCls);
        //this.tapEvent = (this.delay > 0) ? 'taphold' : 'tapstart';
        if (!this.disabled) {
            this.enable();
        }
    },

    // @private
    onTouchStart : function(e, t) {
        if (this.cancelSelector && e.getTarget(this.cancelSelector)) {
            return;
        }
        if (this.handleSelector && !e.getTarget(this.handleSelector)) {
            return;
        }
        
        if (!this.sorting) {
            this.onSortStart(e, t);
        }
    },

    // @private
    onSortStart : function(e, t) {
        this.sorting = true;
        var draggable = new Ext.util.Draggable(t, {
            delay: this.delay,
            revert: this.revert,
            direction: this.direction,
            constrain: this.constrain === true ? this.el : this.constrain,
            animationDuration: 100
        });
        draggable.on({
            dragThreshold: 0,
            drag: this.onDrag,
            dragend: this.onDragEnd,
            scope: this
        });
        
        this.dragEl = t;
        this.calculateBoxes();
        
        if (!draggable.dragging) {
            draggable.onStart(e);
        }
        
        this.fireEvent('sortstart', this, e);
    },

    // @private
    calculateBoxes : function() {
        this.items = [];
        var els = this.el.select(this.itemSelector, false),
            ln = els.length, i, item, el, box;

        for (i = 0; i < ln; i++) {
            el = els[i];
            if (el != this.dragEl) {
                item = Ext.fly(el).getPageBox(true);
                item.el = el;
                this.items.push(item);
            }
        }
    },

    // @private
    onDrag : function(draggable, e) {
        var items = this.items,
            ln = items.length,
            region = draggable.region,
            sortChange = false,
            i, intersect, overlap, item;
            
        for (i = 0; i < ln; i++) {
            item = items[i];
            intersect = region.intersect(item);
            if (intersect) {
                if (this.vertical && Math.abs(intersect.top - intersect.bottom) > (region.bottom - region.top) / 2) {
                    if (region.bottom > item.top && item.top > region.top) {
                        draggable.el.insertAfter(item.el);
                    }
                    else {
                        draggable.el.insertBefore(item.el);
                    }
                    sortChange = true;
                }
                else if (this.horizontal && Math.abs(intersect.left - intersect.right) > (region.right - region.left) / 2) {
                    if (region.right > item.left && item.left > region.left) {
                        draggable.el.insertAfter(item.el);
                    }
                    else {
                        draggable.el.insertBefore(item.el);
                    }
                    sortChange = true;
                }

                if (sortChange) {
                    // We reset the draggable (initializes all the new start values)
                    draggable.reset();

                    // Move the draggable to its current location (since the transform is now
                    // different)
                    draggable.moveTo(region.left, region.top);

                    // Finally lets recalculate all the items boxes
                    this.calculateBoxes();
                    this.fireEvent('sortchange', this, draggable.el, this.el.select(this.itemSelector, false).indexOf(draggable.el.dom));
                    return;
                }
            }
        }
    },

    // @private
    onDragEnd : function(draggable, e) {
        draggable.destroy();
        this.sorting = false;
        this.fireEvent('sortend', this, draggable, e);
    },

    /**
     * Enables sorting for this Sortable.
     * This method is invoked immediately after construction of a Sortable unless
     * the disabled configuration is set to true.
     */
    enable : function() {
        this.el.on('touchstart', this.onTouchStart, this, {delegate: this.itemSelector});
        this.disabled = false;
    },

    /**
     * Disables sorting for this Sortable.
     */
    disable : function() {
        this.el.un('touchstart', this.onTouchStart, this);
        this.disabled = true;
    },
    
    /**
     * Method to determine whether this Sortable is currently disabled.
     * @return {Boolean} the disabled state of this Sortable.
     */
    isDisabled : function() {
        return this.disabled;
    },
    
    /**
     * Method to determine whether this Sortable is currently sorting.
     * @return {Boolean} the sorting state of this Sortable.
     */
    isSorting : function() {
        return this.sorting;
    },
    
    /**
     * Method to determine whether this Sortable is currently disabled.
     * @return {Boolean} the disabled state of this Sortable.
     */
    isVertical : function() {
        return this.vertical;
    },
    
    /**
     * Method to determine whether this Sortable is currently sorting.
     * @return {Boolean} the sorting state of this Sortable.
     */
    isHorizontal : function() {
        return this.horizontal;
    }    
});
