import React, {Component} from "react";
import ReactDOM from "react-dom";
import {Page} from "./component";


// React Component
class Table extends Component {
    constructor(props){
        super(props);
        this.state = {
            delete: document.querySelector('#deleteAuth').value=='True' ? true : false
        };
    };
    render() {
        return (
            <table className="notrbg slideTable">
               <thead>
                    <tr>
                        <th width="30%">监视名</th>
                        <th width="10%">设备数</th>
                        <th width="20%">启动时间</th>
                        <th width="10%">今日</th>
                        <th width="10%">昨日</th>
                        <th width="10%">月均</th>
                        <th width="10%">操作</th>
                    </tr>
               </thead>
                {
                    this.props.datalist.map((list, index) => {
                        return (
                            <tbody key={index}>
                                <tr className={list.warning>list.today ? "ouTable" : "ouTable red"} data-group-id={list._id}>
                                    <td><i className={ list.is_group==1 ? "st" : "" }></i><em>{list.group}</em></td>
                                    <td>{list.device_count}</td>
                                    <td>{list.ctime}</td>
                                    <td>{list.today}</td>
                                    <td>{list.previous}</td>
                                    <td>{list.avg}</td>
                                    {this.state.delete && list.is_group==1 ? <td><span className="delete">删除</span></td> : <td></td>}
                                </tr>
                                {list.is_group==1 ? <InsideTr aps={list.aps} /> : null}
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
                <td colSpan="7">
                    <i></i>
                    <div>
                        <table>
                            <tbody>
                            {
                                this.props.aps.map((ap, index) => {
                                    return (
                                        <tr key={index} data-group-id={ap._id}>
                                            <td width="30%">{ap.group}</td>
                                            <td width="10%">{ap.device_count}</td>
                                            <td width="20%">{ap.ctime}</td>
                                            <td width="10%">{ap.today}</td>
                                            <td width="10%">{ap.previous}</td>
                                            <td width="10%">{ap.avg}</td>
                                            <td width="10%"></td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
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
            pagecount: 1,  // 最大页数
            btnStatus: false,  // button状态
            location: document.getElementById('location').value
        };
    };
    componentDidMount(){
        //$.get('http://mp.bidongwifi.com/sens/list/59918/', function(data) {
        //    if(data.code==200){
        //        this.setState({list: data.groups});
        //    }
        //}.bind(this));
        var self = this;
        var param = {
            page_size: this.state.page_size,
            page: this.state.page,
            keyword: this.state.keyword
        };
        console.log(param);
        sensGroupAjax("get", this.state.location, param, function(data){
            if(data.code==200){
                this.setState({list: data.groups, pagecount:data.page_count, btnStatus: false});
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
        sensGroupAjax("get", this.state.location, param, function(data){
            if(data.code==200){
                this.setState({list: data.groups, pagecount:data.page_count, btnStatus: false});
                removeLoad();
            }
        }.bind(this));
    };
    onPage(page) {
        $('body,html').scrollTop($('#sens').offset().top);
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
    document.querySelector('#sensTable')
);