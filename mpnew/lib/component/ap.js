import React, {Component} from "react";
import ReactDOM from "react-dom";
import {Page, SortCmp} from "./component";


// React Component
class Table extends Component {
    constructor(props){
        super(props);
        this.state = {
            update: document.querySelector('#updateAuth').value=='True' ? true : false,
            bindap: document.querySelector('#apMemTable').getAttribute('data-value')==1 ? true : false
        };
    };
    render() {
        return (
            <table className="tbodyClass">
                <thead>
                {
                    <SortCmp callbackSort={this.props.callbackSort} sortIndex={this.state.sortIndex} xbcheck={this.state.xbcheck}>
                        {this.state.bindap ? <i className="allchk unchk"></i> : null}
                        <span name="mac"><em>MAC地址</em><i></i></span>
                        {this.state.bindap ? <span name="locale"><em>所属</em><i></i></span> : null}
                        <span name="online"><em>状态</em><i></i></span>
                        <span name="vendor"><em>品牌</em><i></i></span>
                        <span name="address"><em>位置</em><i></i></span>
                        <span name="conns"><em>最后连接数</em><i></i></span>
                        {this.state.update ? <i>操作</i> : null}
                    </SortCmp>
                }

                </thead>
                {
                    this.props.datalist.map((list, index) => {
                        return (
                            <tbody key={index}>
                                <tr>
                                    {
                                        this.state.bindap ? (
                                            <td><i className="unchk"></i></td>
                                        ): null
                                    }
                                    <td data-value={list.mac}>{list.mac}</td>
                                    {
                                        this.state.bindap ?
                                            <td style={{width: "102px"}} data-value={list._location ? list._location : ''} data-title={list.resource_name ? list.resource_name : ''}>{list.resource_name}</td> : null
                                    }
                                    <td>{ list.online==1 ? <span style={{color:"#27b600"}}>在线</span> : <span style={{color:"#f74646"}}>离线</span> }</td>
                                    <td>{ list.vendor!="" ? <i className={ "vendor "+list.vendor }></i>: null }</td>
                                    <td style={{width: "250px"}} data-value={list.address ? list.address : ''}>{list.address}</td>
                                    <td>{list.conns}</td>
                                    {
                                        this.state.update ? (
                                            <td>
                                                <span className="edit">编辑</span>
                                                <button type="button" className="btnGrayAutoMin save">保存</button>
                                                <button type="button" className="btnGrayAutoMin cancel">取消</button>
                                            </td>
                                        ) : null
                                    }
                                </tr>
                            </tbody>
                        )
                    })
                }
            </table>
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
                pagesize: this.state.page_size,
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
                removeLoad();
            }
        }.bind(this));
    };
    onPage(page) {
        $('body,html').scrollTop($('#apMemTable').parent().offset().top);
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
    document.querySelector('#apMemTable')
);