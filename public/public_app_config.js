const public_app_config = {
    common: {},
    dev: {
        api: "https://dev_server_address"
    },
    test: {
        api: "https://test_server_address"
    },
    prod: {
        api: "https://production_server_address"
    }
}

//更换开发环境为xx环境
//public_app_config.dev=public_app_config.test