import React, {Component} from "react";
import ReactDOM from "react-dom";
import {Page} from "./component";


// React Component
class Table extends Component {
    render() {
        return (
            <table className="notrbg slideTable imgTd">
               <thead>
                    <tr>
                        <th>头像</th>
                        <th>姓名</th>
                        <th>MAC</th>
                        <th>部门</th>
                        <th>客户端</th>
                        <th>停留时长</th>
                    </tr>
               </thead>
                {
                    this.props.datalist.map((list, index) => {
                        return (
                            <tbody key={index}>
                                <tr className="ouTable" data-group-id={list._id} data-mac={list.sta_mac} data-name={list.name}>
                                    <td><i className="st"></i><img src={list.avatar} className="txx" /></td>
                                    <td>{list.name}</td>
                                    <td>{list.sta_mac}</td>
                                    <td>{list.department}</td>
                                    <td>{list.platform}</td>
                                    <td>{list.time}h</td>
                                </tr>
                                <InsideTr aps={list.section} />
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
                            <thead>
                                <tr>
                                    <th width="20%">感知设备</th>
                                    <th width="20%">感知日期</th>
                                    <th width="20%">出现时间</th>
                                    <th width="20%">消失时间</th>
                                    <th width="20%">停留时长</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                this.props.aps.map((ap, index) => {
                                    return (
                                        <tr key={index}>
                                            <td width="20%">{ap[4]}</td>
                                            <td width="20%">{ap[0]}</td>
                                            <td width="20%">{ap[1]}</td>
                                            <td width="20%">{ap[2]}</td>
                                            <td width="20%">{ap[3]}h</td>
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
            groupId: document.querySelector('#groupId').value,
            start: document.querySelector('#dateStart').value,   // 开始时间
            end: document.querySelector('#dateEnd').value   // 结束时间
        };
    };
    componentDidMount(){
        var self = this;
        var param = {
            page_size: this.state.page_size,
            page: this.state.page,
            keyword: this.state.keyword,
            start: this.state.start,
            end: this.state.end
        };
        console.log(param);
        sensMemberAjax("get", self.state.groupId, param, function(data){
            if(data.code==200){
                this.setState({list: data.members, pagecount:data.page_count, btnStatus: false});
            }
        }.bind(this));
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
        // 设备切换
        var deviceLi = document.querySelector('#sensDevice');
        for(var i=0; i<deviceLi.getElementsByTagName('li').length; i++){
            deviceLi.getElementsByTagName('li')[i].addEventListener('click', function(){
                $(this).addClass('act').siblings().removeClass('act');
                console.log(this.getAttribute("data-groupId"));
                self.setState({page: 1, groupId: this.getAttribute("data-groupId")}, function(){
                    self.ajaxHandle();
                });
            });
        }
        // 开始结束时间
        $("#dateStart").datetimepicker({
            dateFormat: 'yy-mm-dd',
            stepMinute: 10,
            onClose: function(selectedDate) {
                $("#dateEnd").datepicker("option", "minDate", selectedDate);
                self.setState({start: selectedDate});
                console.log(selectedDate);
            }
        });
        $("#dateEnd").datetimepicker({
            dateFormat: 'yy-mm-dd',
            stepMinute: 10,
            onClose: function(selectedDate) {
                $("#dateStart").datepicker("option", "maxDate", selectedDate);
                self.setState({end: selectedDate});
                console.log(selectedDate);
            }
        });
        var dateSearch = document.querySelector('#dateSearch');
        dateSearch.addEventListener('click', function(){
            self.ajaxHandle();
        });
    };
    ajaxHandle() {
        addLoad('正在加载中...');
        var param = {
            page_size: this.state.page_size,
            page: this.state.page,
            keyword: this.state.keyword,
            start: this.state.start,
            end: this.state.end
        };
        console.log(param);
        sensMemberAjax("get", this.state.groupId, param, function(data){
            if(data.code==200){
                this.setState({list: data.members, pagecount:data.page_count, btnStatus: false});
                removeLoad();
            }
        }.bind(this));
    };
    onPage(page) {
        $('body,html').scrollTop($('#sensRoom').offset().top);
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
    document.querySelector('#sensMemTable')
);