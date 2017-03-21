import React, {Component} from "react";
import ReactDOM from "react-dom";
import {Page} from "./component";


// React Component
class Table extends Component {
    constructor(props){
        super(props);
        this.state = {
            update: document.querySelector('#updateAuth').value=='True' ? true : false,
            location: document.querySelector('#location').value
        };
    };
    slideTable(e){
        var self = this;
        var $this = $(e.target);
        var $div=$this.parents('.ouTable').next('.siTable').find('div');
        var $i=$this.parents('.ouTable').next('.siTable').find('i');
        if($div.is(":hidden")){
            var param = {
                page_size: -1,
                page: 1,
                location: self.state.location,
                keyword: '',
                sort: JSON.stringify({}),
                ap_mac: $this.parent().data('value'),
                inner: 0
            };
            userOnlineAjax("get", '', param, function(data){
                console.log(data);
                if(data.code==200){
                    var users = data.online_users;
                    for(var i=0, h=''; i<users.length; i++){
                        var list = users[i];
                        var mask=((list.mask & (1<<30)) <= 0);
                        h += '<tr class="'+(mask ? '' : "dab")+'">'+
                            '<td>'+list.user+'</td>'+
                            '<td>'+((!list.name)?'':list.name)+'</td>'+
                            '<td>'+((!list.mobile)?'':list.mobile)+'</td>'+
                            '<td>'+list.traffic+'M</td>'+
                            '<td>'+list.platform+'</td>';
                        if(self.state.update){
                            h += '<td><a href="/projectuseraccountinfo.html?user_id='+list.user+'&location='+self.state.location+'">详情</a>'+ (mask ? '<span class="forbin">停用</span>' : '<span class="unforbin">启用</span>') +'<input type="hidden" class="id" value="'+list.user+'" /><input type="hidden" class="mask" value="'+list.mask+'" /><input type="hidden" class="mac" value="'+list.mac+'" /></td>'
                        }
                        h+='<tr>';
                    }
                    $div.find('tbody').html(h);

                    $this.addClass('on');
                    $i.show();
                    $div.slideDown();
                }
            });
        }else{
            $this.removeClass('on');
            $div.slideUp('normal', function(){$i.hide();});
        }
    };
    render() {
        return (
            <table className="notrbg slideTable imgTd">
                <thead>
                    <tr>
                        <th>MAC地址</th>
                        <th>所属</th>
                        <th>状态</th>
                        <th>品牌</th>
                        <th>位置</th>
                        <th>在线人数</th>
                        {this.state.update ? <th>操作</th> : null}
                    </tr>
                </thead>
                {
                    this.props.datalist.map((list, index) => {
                        return (
                            <tbody key={index}>
                                <tr className="ouTable">
                                    <td width="20%" data-value={list.mac}>{ (list.conns == 0) ? null : <i className="st" ref="st" onClick={this.slideTable.bind(this)}></i> }{list.mac}</td>
                                    <td width="13%" data-value={list._location ? list._location : ''} data-title={list.resource_name ? list.resource_name : ''}>{list.resource_name}</td>
                                    <td width="6%">{ list.online==1 ? <span style={{color:"#27b600"}}>在线</span> : <span style={{color:"#f74646"}}>离线</span> }</td>
                                    <td width="8%">{ list.vendor!="" ? <i className={ "vendor "+list.vendor }></i>: null }</td>
                                    <td width="25%" data-value={list.address ? list.address : ''}>{list.address}</td>
                                    <td width="10%">{list.conns}</td>
                                    {
                                        this.state.update ? (
                                            <td width="18%">
                                                <span className="edit">编辑</span>
                                                <button type="button" className="btnGrayAutoMin save">保存</button>
                                                <button type="button" className="btnGrayAutoMin cancel">取消</button>
                                            </td>
                                        ) : null
                                    }
                                </tr>
                                { (list.conns == 0) ? null : <InsideTr update={this.state.update} /> }
                            </tbody>
                        )
                    })
                }
            </table>
        )
    }
}

// 下拉表单
class InsideTr extends Component {
    render() {
        return (
            <tr className="siTable">
                <td colSpan={this.props.update ? '7' : '6'}>
                    <i></i>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th width="22%">用户唯一ID</th>
                                    <th width="12%">姓名</th>
                                    <th width="22%">手机号</th>
                                    <th width="12%">流量</th>
                                    <th width="12%">客户端</th>
                                    {
                                        this.props.update ? <th width="10%">操作</th> : null
                                    }
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </td>
            </tr>
        )
    }
}

// 整体
class Box extends Component {
    constructor(props){
        super(props);
        this.state = {
            list: [],
            page_size: 50,   // 每页显示数量
            page: 1,        // 当前页数
            keyword: '',    // 搜索关键字
            pagecount: 10,  // 最大页数
            btnStatus: false,  // button状态
            sort: JSON.stringify({}),       // 排序
            sortIndex : 100,
            xbcheck: true,
            online: '',
            vendor: '',
            isbind: '',
            location: document.querySelector('#location').value
        };
    };
    componentDidMount(){
        var self = this;
        if(!!history.state){
            this.setState({
                list: history.state.list,
                page: history.state.page,
                keyword: history.state.keyword,
                pagecount: history.state.pagecount,
                sort: history.state.sort,
                sortIndex: history.state.sortIndex,
                xbcheck: history.state.xbcheck,
                online: history.state.online,
                vendor: history.state.vendor,
                isbind: history.state.isbind
            });
            console.log(history.state);
        }else {
            var param = {
                page_size: this.state.page_size,
                page: this.state.page,
                location: this.state.location,
                keyword: this.state.keyword,
                sort: this.state.sort
            };
            console.log(param);
            apAjax("get", param, function (data) {
                if (data.code == 200) {
                    this.setState({list: data.aps, pagecount: data.page_count, btnStatus: false});
                }
            }.bind(this));
        }
        // 搜索监听
        var searchBtn = document.querySelector('#search');
        searchBtn.firstChild.addEventListener('change', function(){
            console.log(this.value);
            self.setState({keyword: this.value.trim()});
        });
        searchBtn.lastChild.addEventListener('click', function(){
            self.setState({page: 1}, function(){
                self.ajaxHandle();
            });
        });
        // 筛选条件
        if(document.querySelector('#online')){
            var online = document.querySelector('#online');
            online.addEventListener('change', function(){
                self.setState({online: this.value, page: 1}, function(){
                    self.ajaxHandle();
                });
            });
        }
        if(document.querySelector('#vendor')){
            var vendor = document.querySelector('#vendor');
            vendor.addEventListener('change', function(){
                self.setState({vendor: this.value, page: 1}, function(){
                    self.ajaxHandle();
                });
            });
        }
        if(document.querySelector('#isbind')){
            var isbind = document.querySelector('#isbind');
            isbind.addEventListener('change', function(){
                self.setState({isbind: this.value, page: 1}, function(){
                    self.ajaxHandle();
                });
            });
        }
        $(document).on('click', '#locationSel_myselect .select_item', function(){
            var locate=$(this).attr('data-locate');
            self.setState({location: locate, page: 1}, function(){
                self.ajaxHandle();
            });
        });
    };
    ajaxHandle() {
        addLoad('正在加载中...');
        var self = this;
        var param = {
            page_size: this.state.page_size,
            page: this.state.page,
            keyword: this.state.keyword,
            sort: this.state.sort,
            online: this.state.online,
            vendor: this.state.vendor,
            isbind: this.state.isbind,
            location: this.state.location
        };
        console.log(param);
        apAjax("get", param, function(data){
            if(data.code==200){
                this.setState({list: data.aps, pagecount:data.page_count, btnStatus: false}, function(){
                    history.pushState({
                        list: self.state.list,
                        page: self.state.page,
                        keyword: self.state.keyword,
                        pagecount: self.state.pagecount,
                        sort: self.state.sort,
                        sortIndex: self.state.sortIndex,
                        xbcheck: self.state.xbcheck,
                        online: self.state.online,
                        vendor: self.state.vendor,
                        isbind: self.state.isbind
                    }, '', window.location.href);
                    console.log(history.state);
                });
                $('.edit').show();$('.save, .cancel').hide();
                $('.ouTable .st').removeClass('on');
                $('.siTable td>i').hide();
                $('.siTable td>div').hide();
                removeLoad();
            }
        }.bind(this));
    };
    onPage(page) {
        $('body,html').scrollTop($('#aponlineMemTable').parent().offset().top);
        $('.unchk').removeClass('chk');
        this.setState({page: page, btnStatus: true}, function(){
            this.ajaxHandle();
        });
    };
    onSort(sort, sortIndex, xbcheck) {
        this.setState({sort: sort, sortIndex: sortIndex, xbcheck: xbcheck, btnStatus: true}, function(){
            this.ajaxHandle();
        });
    };
    render() {
        return (
            <div className="areabox">
                <Table datalist={this.state.list} callbackSort={this.onSort.bind(this)} sortIndex={this.state.sortIndex} xbcheck={this.state.xbcheck} />
                <Page page={this.state.page} pagecount={this.state.pagecount} callbackPage={this.onPage.bind(this)} btnDis={this.state.btnStatus} />
            </div>
        )
    }
}

ReactDOM.render(
    <Box />,
    document.querySelector('#aponlineMemTable')
);