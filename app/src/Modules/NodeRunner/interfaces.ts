export interface NodeProcessConfig {
    runNode: boolean;
    version: string;
    home: string;
    binDir: string;
    configFolder: string;
    logsToStdout: boolean;
    blockNotify: boolean;
}

export interface NodeLogFormat {
    _msg: string;
    level: 'info' | 'error'| 'debug';
    module: ModuleName;
    impl?: string;
    connection?: string;
    /**
     * BlockHash
     */
    hash?: string;

    /**
     * block height
     */
    height?: number;
    nodeInfo?: {
        id: string,
        listen_addr: string,
        network: string,
        version: string,
        channels: string,
        moniker: string,
        protocol_version: {
            p2p: number,
            block: number,
            app: number
        }
        other: object

    };
    addr?: string;
    peer?: string;
    pubKey?: string;
    conn?: string;
    listen_addr?: string;

}

export enum ModuleName {
    'proxy',
    'abci-client',
    'consensus',
    'tendermint',
    'events',
    'p2p',
    'pex',
    'mempool',
    'rpc-server',
    'txindex',
    'evidence',
}

export interface NodeConfigInterface {
    moniker: string;
    gui_listen_addr: boolean;
    api_listen_addr: string;
    keep_state_history: boolean;
    api_simultaneous_requests: number;
    fast_sync:boolean;
    db_backend: string;
    db_path: string;
    log_level: string;
    log_format: string;
    log_path: string;
    priv_validator_file: string;
    node_key_file: string;
    prof_laddr: string;
    rpc: {
        laddr: string
        grpc_laddr: string
        grpc_max_open_connections: number
        unsafe: boolean
        max_open_connections: number
    };
    p2p: {
        allow_duplicate_ip: boolean;
        laddr: string;
        external_address: string;
        seeds: string;
        persistent_peers: string;
        upnp: boolean;
        addr_book_file: string;
        addr_book_strict: boolean;
        flush_throttle_timeout: string;
        max_num_inbound_peers: number;
        max_num_outbound_peers: number;
        max_packet_msg_payload_size: number;
        send_rate: number;
        recv_rate: number;
        pex: boolean;
        seed_mode: boolean;
        private_peer_ids: string;
    };
    mempool: {
        recheck: boolean;
        broadcast: boolean;
        wal_dir: string;
        size: number;
        cache_size: number;
    };
    instrumentation: {
        prometheus: boolean;
        prometheus_listen_addr: string;
        max_open_connections: number;
        namespace: string;
    };
}


export interface NodeAddressBookInterface {
    key: string,
    addrs: AddressBookItemInterface[]
}


interface AddressBookItemInterface {
    addr: {
        id: string,
        ip: string,
        port: number
    },
    src: {
        id: string,
        ip: string,
        port: number
    },
    attempts: number,
    last_attempt: Date,
    last_success: Date,
    bucket_type: number,
    buckets: any // todo
}
