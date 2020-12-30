const url_config = {
    test: {
        api: "https://test_server_address"
    },
    prod: {
        api: "https://production_server_address"
    },
    dev: {
        api: "https://dev_server_address"
    }
}

//更换开发环境为xx环境
//url_config.dev=url_config.test