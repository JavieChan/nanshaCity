import React, {Component} from "react";
import ReactDOM from "react-dom";
import { Router, Route, Link, browserHistory } from 'react-router';

class Header extends Component{
    render(){
        return(
            <div className="header">
                <div className="wrapper">
                    <a href="/" title="分布式认证系统" className="logo nansha">分布式认证系统</a>
                    <div class="admin">
                        <img src="../static/images/logo_bidong.png" />
                        <span className="username">Bidong</span>
                        <span className="cutofline"><i></i></span>
                        <a href="javascript:;" className="logout">退出</a>
                    </div>
                    <div className="search">
                        <input type="text" />
                        <button type="button"><i className="searchIco"></i></button>
                    </div>
                </div>
            </div>
        )
    }
}

class APP extends Component{
    render(){
        return(
            <div id="app">
                <Header />
            </div>
        )
    }
}

ReactDOM.render(
    <APP />,
    document.body
);