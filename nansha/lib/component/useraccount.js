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
            view: document.querySelector('#viewAuth').value=='True' ? true : false,
            location: document.querySelector('#location').value
        };
    };
    // 删除
    handleDel(e){
        if(confirm('确定要删除吗？')){
            var delIndex = e.target.getAttribute('data-key');
            var id = e.target.parentNode.getElementsByClassName('id')[0].value;
            this.props.onDel(delIndex, id);
        }
    };
    render() {
        return (
            <table className="tbodyClass">
                <thead>
                {
                    <SortCmp callbackSort={this.props.callbackSort} update={this.state.update} sortIndex={this.props.sortIndex} xbcheck={this.props.xbcheck}>
                        <span name="mobile"><em>电话号码</em><i></i></span>
                        <span name="user"><em>上网账号</em><i></i></span>
                        <span name="password"><em>密码</em><i></i></span>
                        <span name="expired"><em>到期时间</em><i></i></span>
                        <span name="ends"><em>终端数</em><i></i></span>
                        { this.state.location.indexOf('29946')==0 ? null : <span name="ends"><em>备注</em><i></i></span> }
                        <i>操作</i>
                    </SortCmp>
                }

                </thead>
                {
                    this.props.datalist.map((list, index) => {
                        var mask=(list.mask & (1<<30)) <= 0;
                        var holder = lastStr(this.state.location);

                        return (
                            <tbody key={index}>
                                <tr className={mask ? null : "dab"}>
                                    <td>{list.mobile}</td>
                                    <td>{list.user}</td>
                                    <td data-tip={list.password} className="pwdtip">***</td>
                                    <td>{list.expired}</td>
                                    <td>{list.ends}</td>
                                    { this.state.location.indexOf('29946')==0 ? null : <td>{list.note}</td> }
                                    <td>
                                        { this.state.view ? <a href={"/projectuseraccountinfo.html?location="+this.state.location+"&mask=2&user_id="+list.user+"&mac="+list.user+"&ip="+list.ip}>详情</a> : null }
                                        { !this.state.update||(holder==list.user) ? null : ( mask ? <span className="forbin">停用</span> : <span className="unforbin">启用</span> ) }
                                        { !this.state.delete||(holder==list.user) ? null : <span className="delete" onClick={this.handleDel.bind(this)} data-key={index}>删除</span> }
                                        { holder==list.user ? null : <input type="hidden" className="id" value={list.user} /> }
                                        { holder==list.user ? null : <input type="hidden" className="mask" value={list.mask} /> }
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
        }else {
            var param = {
                page_size: this.state.page_size,
                page: this.state.page,
                location: this.state.location,
                keyword: this.state.keyword,
                sort: this.state.sort
            };
            console.log(param);
            userAccountAjax("get", '', param, function (data) {
                if (data.code == 200) {
                    this.setState({list: data.account_users, pagecount: data.page_count, btnStatus: false});
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
        // 新增
        var addBtn = document.querySelector('#add');
        addBtn.addEventListener('click', function(){
            if(checkInput($('#modalRoomAccount .veright'))==0){
                var location = $('#location').val();
                var param={
                    location: location,
                    mobile: $('input[name=mobile]').val(),
                    user: $('input[name=user]').val(),
                    password: $('input[name=password]').val(),
                    expired: $('input[name=expired]').val(),
                    ends: $('input[name=ends]').val()
                };
                if(location.indexOf('29946')!=0){
                    param.note = $('input[name=note]').val();
                }
                if(location.indexOf('206386')==0){
                    param.mac = $('input[name=mac]').val();
                }
                userAccountAjax("post", "", param, function(data){
                    if(data.code==200){
                        $('#modalRoomAccount').modal('closed');
                        var rows = self.state.list;
                        var $data = {
                            mobile: data.mobile,
                            user: data.user,
                            password: data.password,
                            expired: data.expired,
                            ends: data.ends,
                            mask: data.mask
                        };
                        if(location.indexOf('29946')!=0){
                            $data.note = data.note;
                        }
                        rows.unshift($data);
                        self.setState({list: rows});
                    }else{
                        alert(data.reason);
                    }
                });
            }
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
        userAccountAjax("get", '', param, function(data){
            if(data.code==200){
                this.setState({list: data.account_users, pagecount:data.page_count, btnStatus: false}, function(){
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
        $('body,html').scrollTop($('#userAccountMemTable').parent().offset().top);
        this.setState({page: page, btnStatus: true}, function(){
            this.ajaxHandle();
        });
    };
    onSort(sort, sortIndex, xbcheck) {
        this.setState({sort: sort, sortIndex: sortIndex, xbcheck: xbcheck, btnStatus: true}, function(){
            this.ajaxHandle();
        });
    };
    onDelete(index, id) {
        this.state.list.splice(index, 1);
        var rows = this.state.list;
        userAccountAjax("delete", $.trim(id), '', function(data){
            if(data.code==200){
                this.setState({list: rows});
            }else{
                alert("删除失败");
            }
        }.bind(this));
    };
    render() {
        return (
            <div className="areabox">
                <Table datalist={this.state.list} callbackSort={this.onSort.bind(this)} onDel={this.onDelete.bind(this)} sortIndex={this.state.sortIndex} xbcheck={this.state.xbcheck} />
                <Page page={this.state.page} pagecount={this.state.pagecount} callbackPage={this.onPage.bind(this)} btnDis={this.state.btnStatus} />
            </div>
        )
    }
}

ReactDOM.render(
    <Box />,
    document.querySelector('#userAccountMemTable')
);