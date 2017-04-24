import React, {Component} from "react";
import ReactDOM from "react-dom";
import {Page} from "./component";


// React Component
class Table extends Component {
    constructor(props){
        super(props);
        this.state = {
            update: document.querySelector('#updateAuth').value=='True' ? true : false
        };
    };
    render() {
        return (
            <table className="tbodyClass">
               <thead>
                    <tr>
                        <th>账户</th>
                        <th>密码</th>
                        <th>所属项目</th>
                        <th>角色</th>
                        <th>创建时间</th>
                        { this.state.update ? <th>操作</th> : null }
                    </tr>
               </thead>
                {
                    this.props.datalist.map((list, index) => {
                        return (
                            <tbody key={index}>
                                <tr className={ list.mask==0 ? "dab" : null }>
                                    <td data-value={list.name}>{list.name}</td>
                                    <td>***</td>
                                    <td data-value={list._location}>{list.resource_name}</td>
                                    <td data-value={list.role}>{list.role}</td>
                                    <td data-value={list.ctime}>{list.ctime}</td>
                                    {
                                        this.state.update ? (
                                            <td>
                                                { list.mask==0 ? <span className="unforbin">启用</span> : <span className="forbin">停用</span> }
                                                <span className="edit">编辑</span>
                                                <input type="hidden" name="name" value={list.name} />
                                                <input type="hidden" name="sensgoups" value={list.sens_group} />
                                            </td>
                                        ) : (
                                            null
                                        )
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
            pagecount: 1,  // 最大页数
            btnStatus: false  // button状态
        };
    };
    componentDidMount(){
        var self = this;
        var param = {
            page_size: this.state.page_size,
            page: this.state.page,
            keyword: this.state.keyword
        };
        console.log(param);
        accountAjax("get", param, function(data){
            if(data.code==200){
                this.setState({list: data.managers, pagecount:data.page_count, btnStatus: false});
            }
        }.bind(this));
        // 搜索监听
        var searchBtn = document.querySelector('#search');
        searchBtn.firstChild.addEventListener('change', function(){
            console.log(this.value);
            self.setState({keyword: this.value});
        });
        searchBtn.lastChild.addEventListener('click', function(){
            self.setState({page: 1}, function(){
                self.ajaxHandle();
            });
        });
    };
    ajaxHandle() {
        addLoad('正在加载中...');
        var param = {
            page_size: this.state.page_size,
            page: this.state.page,
            keyword: this.state.keyword
        };
        console.log(param);
        accountAjax("get", param, function(data){
            if(data.code==200){
                this.setState({list: data.managers, pagecount:data.page_count, btnStatus: false});
                removeLoad();
            }
        }.bind(this));
    };
    onPage(page) {
        $('body,html').scrollTop($('#adminMemTable').parent().offset().top);
        this.setState({page: page, btnStatus: true}, function(){
            this.ajaxHandle();
        });
    };
    render() {
        return (
            <div className="areabox">
                <Table datalist={this.state.list} />
                <Page page={this.state.page} pagecount={this.state.pagecount} callbackPage={this.onPage.bind(this)} btnDis={this.state.btnStatus} />
            </div>
        )
    }
}

ReactDOM.render(
    <Box />,
    document.querySelector('#adminMemTable')
);