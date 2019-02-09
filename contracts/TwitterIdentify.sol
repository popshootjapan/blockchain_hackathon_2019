pragma solidity ^0.5.0;

contract TwitterIdentify {

    // アドレスとTwitterアカウントIDのmapping
    mapping(address => string) public twitterIdentifications;

    function identify(string memory twitterId, bytes32 hash, bytes memory signature) public {
        if (ecverify(hash, signature) == msg.sender) {
            twitterIdentifications[msg.sender] = twitterId;
        }
    }
    
    function ecverify(bytes32 hash, bytes memory signature) internal pure returns(address sig_address) {
        require(signature.length == 65);

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }

        if (v < 27) {
            v += 27;
        }

        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = keccak256(abi.encodePacked(prefix, hash));

        require(v == 27 || v == 28);
        sig_address = ecrecover(prefixedHash, v, r, s);

        require(sig_address != address(0));
    }
}