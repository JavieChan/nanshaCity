Vue.component('paginator', {
    template: '<div class="paginator">\
            <button type="button" class="btnWhiteSmall" v-on:click="pagePrev">上一页</button>\
            <span>{{ page }}</span> / <span>{{ total }}</span>\
            <button type="button" class="btnWhiteSmall" v-on:click="pageNext">下一页</button>\
            <input type="text"  v-model="jump" style="width:60px" placeholder="1" />\
            <button type="button" class="btnWhiteSmall" v-on:click="pageJump" style="width:60px">跳转</button>\
        </div>',
    props: ['currentPage', 'totalPage', 'jumpPage'],
    data: function(){
        return {
            page: this.currentPage,
            total: this.totalPage,
            jump: this.jumpPage
        }
    },
    watch: {
        currentPage: function(val, old){
            this.page = val;
        },
        totalPage: function(val, old){
            this.total = val;
        },
        jumpPage: function(val, old){
            this.jump = val;
        }
    },
    methods: {
        pagePrev: function(){
            this.page -= 1;
            if(this.page < 1){
                this.page = 1;
                return false;
            }
            this.$emit('page-change', this.page);
        },
        pageNext: function(){
            this.page += 1;
            if(this.page > this.total){
                this.page = this.total;
                return false;
            }
            this.$emit('page-change', this.page);
        },
        pageJump: function(){
            if(this.jump>=1 && this.jump<=this.total){
                this.page = this.jump;
                this.$emit('page-change', this.page);
            }
        }
    }
});