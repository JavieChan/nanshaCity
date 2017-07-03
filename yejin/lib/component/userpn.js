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
    // 删除
    handleDel(e){
        if(confirm('确定要删除吗？')){
            var delIndex = e.target.getAttribute('data-key');
            var id = e.target.parentNode.getElementsByClassName('id')[0].value;
            this.props.onDel(delIndex, id);
        }
    };
    render() {
        var headerRow = [];
        return (
            <table className="tbodyClass">
                <thead>
                {
                    <SortCmp callbackSort={this.props.callbackSort} update={this.state.update} sortIndex={this.state.sortIndex} xbcheck={this.state.xbcheck}>
                        {
                            this.props.headers.map((header, index) => {
                                if(header.is_profile==1){
                                    headerRow.push(header.column);
                                    return (
                                        <span name={header.column} key={index}><em>{header.title}</em><i></i></span>
                                    )
                                }
                            })
                        }
                        <i>操作</i>
                    </SortCmp>
                }

                </thead>
                {
                    this.props.datalist.map((list, index) => {
                        var location = document.querySelector('#location').value;
                        var forbin = ((list.mask&(1<<30))==0 ? <span className="forbin">停用</span> : <span className="unforbin">启用</span>);
                        return (
                            <tbody key={index}>
                                <tr className={ ((list.mask&(1<<30))==0) ? null : "dab" }>
                                    {
                                        headerRow.map((header, index) => {
                                            return (
                                                <td key={index}>{list[header]}</td>
                                            )
                                        })
                                    }
                                    <td>
                                        { (this.state.view && (list.mask&(1<<30))==0) ? <span className="recharge">充值</span> : null }
                                        { (this.state.view && (list.mask&(1<<30))==0) ? <a href={"/projectuserpninfo.html?location="+location+"&mask=1&user_id="+list.id}>编辑</a> : null }
                                        { this.state.update ? (forbin) : null }
                                        { this.state.delete ? <span className="delete" onClick={this.handleDel.bind(this)} data-key={index}>删除</span> : null }
                                        <input type="hidden" className="id" value={list.id} />
                                        <input type="hidden" className="mask" value={list.mask} />
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
            xbcheck: true,
            mask: '',
            header: []     // 表头
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
                mask: history.state.mask,
                header: history.state.header
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
            userPnAjax("get", '', param, function (data) {
                if (data.code == 200) {
                    this.setState({
                        list: data.pn_users,
                        pagecount: data.page_count,
                        btnStatus: false,
                        header: data.headers
                    });
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
            var obj={}, param={}, location=$('#location').val();
            $('#modalRoomPn .vertical').find('input').each(function(i, n){
                var sn=$(n).attr('name'), dtype=$(n).data('type');
                if(dtype=='int'){
                    obj[sn]=parseInt($(n).val());
                }else if(sn=='user'){
                    obj[sn]=lastStr(location)+$(n).val();
                }else{
                    obj[sn]=$(n).val();
                }
            });
            param.location = location;
            param.params = JSON.stringify(obj);

            if(checkInput($('#modalRoomPn .vertical'))==0){
                userPnAjax("post", '', param, function(data){
                    if(typeof(data["_code"])!="undefined" && data["_code"]==400){//错误码
                        alert(data.reason);
                        return;
                    }
                    if(data.code==200){
                        window.location.reload();
                    }
                }, function(data){
                    if(typeof(data["_code"])!="undefined" && data["_code"]==400){//错误码
                        alert(data.reason);
                    }
                });
            }
        });
        // 审核
        if(document.querySelector('#maskCheck')){
            var mc = document.querySelector('#maskCheck');
            mc.addEventListener('change', function(){
                self.setState({mask: (this.value=='' ? '': 1<<this.value), page: 1}, function(){
                    self.ajaxHandle();
                });
            });
        }
    };
    ajaxHandle() {
        addLoad('正在加载中...');
        var self = this;
        //history.pushState({
        //    list: [],
        //    page: 2,
        //    keyword: self.state.keyword,
        //    pagecount: 10,
        //    sort: self.state.sort,
        //    sortIndex: self.state.sortIndex,
        //    xbcheck: self.state.xbcheck,
        //    mask: self.state.mask
        //}, '', window.location.href);
        var param = {
            page_size: this.state.page_size,
            page: this.state.page,
            location: this.state.location,
            keyword: this.state.keyword,
            sort: this.state.sort
        };
        if(this.state.mask!=''){
            param.mask = this.state.mask;
        }
        console.log(param);
        userPnAjax("get", '', param, function(data){
            if(data.code==200){
                this.setState({list: data.pn_users, pagecount:data.page_count, btnStatus: false}, function(){
                    history.pushState({
                        list: self.state.list,
                        page: self.state.page,
                        keyword: self.state.keyword,
                        pagecount: self.state.pagecount,
                        sort: self.state.sort,
                        sortIndex: self.state.sortIndex,
                        xbcheck: self.state.xbcheck,
                        mask: self.state.mask,
                        header: self.state.header
                    }, '', window.location.href);
                    console.log(history.state);
                });
                removeLoad();
            }
        }.bind(this));
    };
    onPage(page) {
        $('body,html').scrollTop($('#userPnMemTable').parent().offset().top);
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
        userPnAjax("delete", id, {location: this.state.location}, function(data){
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
                <Table datalist={this.state.list} callbackSort={this.onSort.bind(this)} onDel={this.onDelete.bind(this)} headers={this.state.header} sortIndex={this.state.sortIndex} xbcheck={this.state.xbcheck} />
                <Page page={this.state.page} pagecount={this.state.pagecount} callbackPage={this.onPage.bind(this)} btnDis={this.state.btnStatus} />
            </div>
        )
    }
}

ReactDOM.render(
    <Box />,
    document.querySelector('#userPnMemTable')
);