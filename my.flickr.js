$.flickr = {
    s: {
        api_key: 'e87e482f5fdc62d84389b0555aeb3754',
        type: 'search', // allowed values: 'photoset', 'search'
        user_id: null,
        api_url: null,
        callback: null,
        photoset_id: null,
        group_id: null,
        tags: null,         // comma separated list
        tag_mode: null,     // allowed values: 'any' (OR), 'all' (AND)
        text: null,
        sort: null,         // date-posted-asc, date-posted-desc, date-taken-asc, date-taken-desc, interestingness-desc, interestingness-asc, relevance
        thumb_size: 's',    // allowed values: s (75x75), t (100x?), m (240x?)
        size: 'm',         // default: (500x?), allowed values: m (240x?),  o (original)
        per_page: null,     // default: 100, max: 500
        litebox: false      // boolean, if true requires jquery.litebox.js 
	},
	
    format: function(){

        if (this.s.url) return this.s.url;
        if (!this.s.callback) this.s.callback = 'jQuery.flickr.response';
        var url = 'http://api.flickr.com/services/rest/?format=json&jsoncallback='+this.s.callback+'&api_key='+this.s.api_key;
		
        switch (this.s.type){
            case 'photoset':
                url += '&method=flickr.photosetthis.s.getPhotos&photoset_id=' + this.s.photoset_id;
                break;
            case 'search':
                url += '&method=flickr.photos.search';
                if (this.s.user_id) url += '&user_id=' + this.s.user_id;
                if (this.s.group_id) url += '&group_id=' + this.s.group_id;
                if (this.s.tags) url += '&tags=' + this.s.tags;
                if (this.s.tag_mode) url += '&tag_mode=' + this.s.tag_mode;
                if (this.s.text) url += '&text=' + this.s.text;
                if (this.s.sort) url += '&sort=' + this.s.sort;
                break;
            default:
                url += '&method=flickr.photothis.s.getRecent';
        }
        if (this.s.per_page) url += '&per_page=' + this.s.per_page;
        if (this.s.size == 'o') url += '&extras=original_format';
        return url;
    },
    request: function(){
		var url = this.format();

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        $('head').append(script);
    },
	
    response: function(r){

		// Flickr img URL sample
		// http://farm3.static.flickr.com/2166/2300707514_1cd9a7b2b4_s.jpg = 75x75
		// http://farm3.static.flickr.com/2166/2300707514_1cd9a7b2b4_t.jpg = 100x67
		// http://farm3.static.flickr.com/2166/2300707514_1cd9a7b2b4_m.jpg = 240x160
		// http://farm3.static.flickr.com/2166/2300707514_1cd9a7b2b4.jpg   = 500x333
		// http://farm3.static.flickr.com/2166/2300707514_1cd9a7b2b4_b.jpg = 1024x653

		// 初期化
		$('#flickr').html("");
		$.stokeshot.images = [];
		$.stokeshot.order = [];
			
        if (r.stat != "ok"){
            $('#flickr').append('Flickr error<br />');
            for (i in r){
                $('#flickr').append(''+i+': '+i[r]+'<br />');
            }
        } else {
			
            if ( this.s.type == 'photoset' ) {
                r.photos = r.photoset;
            }


			
			// console.debug(r.photos);
            for (var i=0; i<r.photos.photo.length; i++ ) {
                                                   
                var photo = r.photos.photo[i];
                var id = "img" + photo['id'];                                   
                                                   
                var thumb = 'http://farm'+photo['farm']+'.static.flickr.com/'+photo['server']+'/'+photo['id']+'_'+photo['secret']+'_'+this.s.thumb_size+'.jpg';
                                                   
                var h = 'http://farm'+photo['farm']+'.static.flickr.com/'+photo['server']+'/'+photo['id']+'_';

				var small = h + photo['secret']+'_m.jpg';
				var medium = h + photo['secret']+'.jpg';
                var large = h + photo['secret']+'_b.jpg';

                $.stokeshot.images[id] = {
                    title: id,  
                    large_url: large,
					medium_url: medium,
                    small_url: small, 
                    icon_url: thumb, 
                    width: "0", 
                    height: "0"  
                };                                    

                $('#flickr').append('<div class="float" ><img src="'+ thumb  +'" /><br /><input type="checkbox" class="imagechoice" value="img' + photo['id']  + '" />写真 <input type="checkbox" class="iconchoice" value="img' + photo['id']  + '" />Icon</div>');
                                                   
            }
        };

        $("input[@type=checkbox].imagechoice").change(function(){
          $.stokeshot.showOrder(this.value);
          $.stokeshot.refreshTextarea();

        // console.debug(myalbum.order);
        });

        $("input[@type=checkbox].iconchoice").change(function(){
          $.stokeshot.showIcons("#tab-order div#preview-icon");
          $.stokeshot.refreshTextarea();

         // console.debug(myalbum.order);
        });                                                    
                                   
    }
};
