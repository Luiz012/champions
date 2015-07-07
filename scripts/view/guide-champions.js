var CoC = CoC || {};
CoC.view = CoC.view || {};
CoC.view.GuideChampionsView = Backbone.View.extend({
  initialize: function(){
    var that = this;
    that._instant = true;
    that._guideViews = {};
    that._championViews = [];
    that._uids = [];
    that._indices = {};
    that._selector = $("#guide-champions-selector");
    
    var uids = _.uniq( CoC.data.champions.pluck("uid") );
    
    _(uids).each(function(uid){
      var guide = CoC.guides.get(uid);
      var champion = guide.champion;
      var view = new CoC.view.ChampionView({
        model:champion
      });
      view.render();
      that._championViews.push( $("<li>").append( view.el )[0] );
      
      var selectName = champion.get("name");
      if(champion.get("grade"))
        selectName += " - " + champion.get("grade");
      
      that._selector.append($('<option>', { value:uid }).text( selectName ));
      
      //set uids map
      that._indices[uid] = that._uids.length;
      that._uids.push(uid);
    });
    
    that._selector.change(function(event){
      var uid = this.value;
      var index = that._indices[uid];
      that.active.call(that, event, index, 0);
      
      that._skip = true;
      that.sly.activate(index);
    });
    
    that.sly = new Sly( "#guide-champions-frame", {
      horizontal: 1,
      itemNav: 'forceCentered',
      activateMiddle: 1,
      smart: 1,
      activateOn:'click',
      scrollBy:1,    
      mouseDragging:1,
      touchDragging:1,
      releaseSwing:1,
      speed:0
    },{
      active:function(event,index){
        if(that._skip){
          that._skip = false;
          return;
        }
        that.activate.call(that, event, index, (that._instant)? 0: 300);
      }
    }).init();
    
    //reload on page resize
    $(window).bind("resize", function(){
      that.reload.call(that);
    });
  },
  
  events:{
    "click .champion":"clicked"
  },
  
  disable:function(){
    this.sly.set('keyboardNavBy', null);
  },
  
  enable:function(){
    this.sly.set('keyboardNavBy', 'items');
  },
  
  //Update Sly
  reload:function(){
    var that = this;
    if(CoC.hasUrlParam("page-guide") === false)
      return;
    that.sly.reload();
    
    //do delayed but just once
    if(that._reloadTimeout)
      clearTimeout(that._reloadTimeout);
    that._reloadTimeout = setTimeout(function(){
      if(CoC.hasUrlParam("page-guide") === false)
        return;
      that.sly.reload();
      that._reloadTimeout = undefined;
    }, 250);
  },
  
  //Select a guide by Champion UID
  select:function(uid){
    var index = (uid === undefined)? undefined: (typeof uid === "string")? this._indices[uid]: uid;
    if(index === undefined)
      index = 0;
    this._instant = true;
    this.sly.activate(index, true);
  },
  
  //Sly activate opens 
  activate:function(event, index, delay){
    var item = this.sly.items[index];
    var uid = $(item.el).find(".champion").attr("uid");
    var guide = CoC.guides.get(uid);
    var view = this._guideViews[uid];
    if(!view){
      try{
        if(guide.data !== undefined)
          view = new CoC.view.GuideView({ model:guide });
      }
      catch(error){
        console.log(error);
      }
      //either missing or just broken
      if(!view)
        view = new CoC.view.GuideMissingView({ model:guide });
      view.render();
      this._guideViews[uid] = view;   
    } 
    
    $("#guide-content").addClass("dirty");
    
    var that = this;
    if(that._activateTimeout)
      clearTimeout(that._activateTimeout);
    if(delay > 0){
      that._activateTimeout = setTimeout(function(){
        that.guide.call(that, uid);
        that._activateTimeout = undefined;
      }, delay);
    }
    else
      that.guide.call(that, uid);
  },
  
  guide: function(uid){
    //if we aren't even looking at guides anymore
    if(CoC.hasUrlParam("page-guide") === false)
      return;
      
    this._instant = false;
    this._selector.val(uid).selectmenu("refresh")

    var guide = CoC.guides.get(uid);
    var view = this._guideViews[uid];
    
    var el = $("#guide-content");
    el.empty();
    el.append( $("<img>").addClass("background").attr("src", guide.champion.image() ) );
    el.append( view.el );
    el.trigger("create");
    el.removeClass("dirty");
    
    //scroll to beginning when we replace, and set url so a refresh goes back here
    $.mobile.silentScroll(0);
    CoC.setUrlParam("page-guide","guide",uid);
  },
  
  render: function(){
    this.$el.empty();
    
    //TODO: sort this list
    var container = document.createDocumentFragment();
    _(this._championViews).each(function(view){
      container.appendChild( view );
    });
    this.$el.append(container);
    return this;
  },
  
  destroy: function(){
    this.remove();
    this.unbind();
  }
});