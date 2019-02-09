# blockchain_hackathon_2019
このレポジトリは、経産省主催のブロックチェーンハッカソン2019でのワークショップで使われるレポジトリです。
Twitterとブロックチェーンを使ったアイデンティフィケーションを実現します。
当日の資料は[こちら](https://speakerdeck.com/daisuke310vvv/blockchainhackathon2019-wakusiyotupu-twittertoburotukutienwoshi-tutaaidenteihuikesiyonfalseshi-xian?slide=6)

## 開発環境
- Node(v9.6.1)
- npm(v5.6.0)

## 前準備  
### ①gethoアカウントの生成
- https://getho.io にアクセス
- ユーザー登録をする
- (ノードの画面が確認できたらOKです！)

### ②レポジトリのクローン  
- 今回のアプリケーションのレポジトリを取得します

```
$ git clone git@github.com:popshootjapan/blockchain_hackathon_2019.git
$ cd blockchain_hackathon_2019
```

### ③Nodeのライブラリのインストール  
- webアプリケーションを動かすための依存パッケージをインストールします

```
$ npm install
```

## 以下資料内容より抜粋

## 今日作るもの
### **Twitterとブロックチェーンを使ったアイデンティフィケーションの実現**
簡単にいうと,

**自分のアドレスの身分証明をTwitterを使って実現する**

## アドレスの身分証明？
- 友達に送金したい時に、教えられたアドレスが本当にその人のものかどうかを証明するには？
- そのアドレスと秘密鍵による署名の検証ができたソーシャルアカウントと紐づいていれば、そのアドレスの身分を証明することができる
- 紐づくソーシャルアカウントの数が増えるほど、そのアドレスの信頼度は上がっていく

## 登録フロー
1. 自分のTwitterアカウントID(例: @st_dsk)に対してウォレットアドレスの秘密鍵で署名
2. 署名した文字列をTwitterに投稿
3. ツイートURLから署名を取得し、その署名とTwitterアカウントIDをコントラクトの登録用関数に投げる
4. コントラクトで検証し、成功すればウォレットアドレスとTwitterアカウントIDを紐づけてブロックチェーンに書き込む

## gethoアカウント作成
**[getho.io]()にアクセスし、アカウントの登録**

![inline](https://i.gyazo.com/f6ed205f2fcedafa7629d923b83fd9ef.png)

## gethoダッシュボード
**専用のプライベートノードとドメインが作られます**

![inline](https://i.gyazo.com/a24c583434df8bbea434db2b705632e0.png)

## ハンズオン用のレポジトリを準備
URL: [github.com/popshootjapan/blockchain\_hackathon\_2019]()

レポジトリのダウンロード

**`$ git clone git@github.com:popshootjapan/blockchain_hackathon_2019.git`**

依存ライブラリのインストール

**`$ npm install`**
(※ python2系必須)

## TwitterIdentifyコントラクト
./contracts/TwitterIdentify.sol

```
contract TwitterIdentify {

    // アドレスとTwitterアカウントIDのmapping
    mapping(address => string) public twitterIdentifications;

    function identify(string twitterId, bytes32 hash, bytes signature)
        public { ... }
    
    function ecverify(bytes32 hash, bytes signature) 
        internal pure returns(address sig_address) { ... }
}
```

## コントラクトデプロイ
./migrations/2\_deploy\_TwitterIdetify.js

```
var TwitterIdentify = artifacts.require("./TwitterIdentify.sol");

module.exports = function(deployer) {
    deployer.deploy(TwitterIdentify);
};
```

## コントラクトデプロイ
**※<YOUR SUBDOMAIN>の部分を書き換えてください**
./truffle-config.js

```
module.exports = {
  networks: {
    getho: {
      host: "<YOUR SUBDOMAIN>.getho.io/jsonrpc",
      port: 80,
      network_id: 1010,
      gas: 4712388
    }
  }
}
```

## コントラクトデプロイ

**`$ ./node_modules/.bin/truffle migrate --network getho`**

![inline](https://i.gyazo.com/59176056448781d579f302a5b09c45c2.png)

## ダッシュボード上でTx確認ができます

![inline](https://i.gyazo.com/e278d0665750f418d5c6f0ed5ba247be.png)

## webサーバ起動
<YOUR SUBDOMAIN>と<CONTARCT ADDRESS>を書き換えてください

./app.js

```
var web3 = new Web3('http://<YOUR SUBDOMAIN>.getho.io:80/jsonrpc');

const contractAddr = '<CONTRACT ADDRESS>';
```

## webサーバ起動
**`$ node app.js`**

サーバが立ち上がると、
[http://localhost:3000]()にアクセスできます

## gethoにコントラクトアップロード
ログイン
**`$ ./getho_osx login`**

ノード一覧取得
**`$ ./getho_osx nodes`**

コントラクトのアップロード

**`$ ./getho_osx upload ./builds/contracts/TwitterIdentify.json -s <YOUR SUBDOMAIN>`**

## gethoにコントラクトアップロード
ダッシュボードに追加されます(※画面右下)

![inline](https://i.gyazo.com/bd8ea240a5ff6bdc24a03706ee84c7af.png)

## GUIで実行
関数の実行ができます

![inline](https://i.gyazo.com/7c50816d833763a1bf395cf49d396912.png)

## 追加課題
- コントラクトに署名したURLを保持する
- 署名したURLのリンクをWeb上に表示させる

(※ 答えの実装は`additional_practice`ブランチにあります)
