import "../css/app.css"
import Masonry from 'masonry-layout';
import Alpine from 'alpinejs';
import imagesLoaded from 'imagesloaded';
import { collapse } from '@alpinejs/collapse';
import { themeChange } from "theme-change";

window.Alpine = Alpine

Alpine.data('masonry',()=>({
    init(){
        var msnry = new Masonry(this.$el, {
            itemSelector : '.masonry-item',
            percentPosition : true
        });

        imagesLoaded(this.$el).on('progress', function() {
            msnry.layout();
        });
    }
}));

 
themeChange(false);
Alpine.plugin(collapse);
Alpine.start();
