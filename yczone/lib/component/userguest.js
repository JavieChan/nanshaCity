import React, {Component} from "react";
import ReactDOM from "react-dom";
import {Page, SortCmp} from "./component";


// React Component
class Table extends Component {
    constructor(props){
        super(props);
        this.state = {
            update: document.querySelector('#updateAuth').value=='True' ? true : false,
            delete: document.querySelector('#deleteAuth').value=='True' ? true : false,
            view: document.querySelector('#viewAuth').value=='True' ? true : false
        };
    };
    render() {
        return (
            <table className="tbodyClass">
                <thead>
                {
                    <SortCmp callbackSort={this.props.callbackSort} update={this.state.update} sortIndex={this.props.sortIndex} xbcheck={this.props.xbcheck}>
                        <span name="user"><em>用户唯一ID</em><i></i></span>
                        <span name="address"><em>位置</em><i></i></span>
                        <span name="name"><em>姓名</em><i></i></span>
                        <!--<span name="mobile"><em>手机号</em><i></i></span>-->
                        <span name="traffic"><em>流量</em><i></i></span>
                        <span name="platform"><em>客户端</em><i></i></span>
                        <i>操作</i>
                    </SortCmp>
                }

                </thead>
                {
                    this.props.datalist.map((list, index) => {
                        var mask=(list.mask & (1<<30)) <= 0;
                        var location = document.querySelector('#location').value;
                        var forbin = ( mask ? <span className="forbin">停用</span> : <span className="unforbin">启用</span> );
                        return (
                            <tbody key={index}>
                                <tr className={mask ? null : "dab"}>
                                    <td>{list.user}</td>
                                    <td>{list.address}</td>
                                    <td>{list.name}</td>
                                    <!--<td>{list.mobile}</td>-->
                                    <td>{list.traffic}M</td>
                                    <td>{list.platform}</td>
                                    <td>
                                        { this.state.view ? <a href={"/projectuseraccountinfo.html?user_id="+list.user+"&location="+location+"&mac="+list.user+"&ip="+list.ip}>详情</a> : null }
                                        { this.state.update ? (forbin) : null}
                                        <input type="hidden" className="id" value={list.user} />
                                        <input type="hidden" className="mask" value={list.mask} />
                                        <input type="hidden" className="mac" value={list.mac} />
                                    </td>
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
            pagecount: 1,  // 最大页数
            btnStatus: false,  // button状态
            location: document.querySelector('#location').value,
            sort: JSON.stringify({}),       // 排序
            sortIndex : 100,
            xbcheck: true
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
                xbcheck: history.state.xbcheck
            });
            console.log(history.state);
        }else{
            var param = {
                page_size: this.state.page_size,
                page: this.state.page,
                location: this.state.location,
                keyword: this.state.keyword,
                sort: this.state.sort
            };
            console.log(param);
            userGuestAjax("get", '', param, function(data){
                if(data.code==200){
                    this.setState({list: data.online_users, pagecount:data.page_count, btnStatus: false});
                }
            }.bind(this));
        }
        // 搜索监听
        var searchBtn = document.querySelector('#search');
        searchBtn.firstChild.addEventListener('change', function(){
            self.setState({keyword: this.value.trim()});
        });
        searchBtn.lastChild.addEventListener('click', function(){
            self.setState({page: 1}, function(){
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
            location: this.state.location,
            keyword: this.state.keyword,
            sort: this.state.sort
        };
        console.log(param);
        userGuestAjax("get", '', param, function(data){
            if(data.code==200){
                this.setState({list: data.online_users, pagecount:data.page_count, btnStatus: false}, function(){
                    history.pushState({
                        list: self.state.list,
                        page: self.state.page,
                        keyword: self.state.keyword,
                        pagecount: self.state.pagecount,
                        sort: self.state.sort,
                        sortIndex: self.state.sortIndex,
                        xbcheck: self.state.xbcheck
                    }, '', window.location.href);
                    console.log(history.state);
                });
                removeLoad();
            }
        }.bind(this));
    };
    onPage(page) {
        $('body,html').scrollTop($('#userGuestMemTable').parent().offset().top);
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
    document.querySelector('#userGuestMemTable')
);