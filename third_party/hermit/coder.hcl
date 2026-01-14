binaries = ["coder"]
sha256-source = "https://github.com/coder/coder/releases/download/v${version}/coder_${version}_checksums.txt"
test = "coder --version"

platform "darwin" {
  source = "https://github.com/coder/coder/releases/download/v${version}/coder_${version}_${os}_${arch}.zip"
}

platform "linux" {
  source = "https://github.com/coder/coder/releases/download/v${version}/coder_${version}_${os}_${arch}.tar.gz"
}

description = "Secure environments for developers and their agents"
homepage = "https://coder.com"

version "2.24.2" "2.23.4" "2.24.3" "2.25.1" "2.25.2" "2.26.0" "2.25.3" "2.26.1"
        "2.27.1" "2.27.3" "2.27.4" "2.27.6" "2.29.1" {
  auto-version {
    github-release = "coder/coder"
  }
}

sha256sums = {
  "https://github.com/coder/coder/releases/download/v2.24.2/coder_2.24.2_darwin_arm64.zip": "ec2250123ed50374b06997a29a783a04f0edc35e0b5edefed44ec7c55b3c9183",
  "https://github.com/coder/coder/releases/download/v2.24.2/coder_2.24.2_linux_arm64.tar.gz": "d899043bb8612d8f5edb639360b873bfe65bd1a3fa3d1546f195f9afaf3aa344",
  "https://github.com/coder/coder/releases/download/v2.24.2/coder_2.24.2_linux_amd64.tar.gz": "025ddbbc8b129d4d2f74d0246649e93ffaf12483fa50650878867a930f384ae3",
  "https://github.com/coder/coder/releases/download/v2.24.2/coder_2.24.2_darwin_amd64.zip": "d3e9faf4158a2202855024335b800c456e1075141c6642b92288aee1de11be71",
  "https://github.com/coder/coder/releases/download/v2.23.4/coder_2.23.4_darwin_amd64.zip": "d3ba525e6fbe6bd556727738020ad1ece69a0f0da48b65ccb6bf0f664596d95c",
  "https://github.com/coder/coder/releases/download/v2.23.4/coder_2.23.4_darwin_arm64.zip": "1f930b9d1a240b959bdc5ae8b69aee9c6fa4c74ab04fcfcebba49c3bb37687e1",
  "https://github.com/coder/coder/releases/download/v2.23.4/coder_2.23.4_linux_arm64.tar.gz": "466d422152bba8f2e2ccafb41f711bdaac0f123d538c7b48a9d06bf99fb6d5e0",
  "https://github.com/coder/coder/releases/download/v2.23.4/coder_2.23.4_linux_amd64.tar.gz": "b69536ebedcdadf3945a077859abf57e14ccb44ae1d825eddcdafc05321475b7",
  "https://github.com/coder/coder/releases/download/v2.24.3/coder_2.24.3_darwin_arm64.zip": "823d9cede638310b0509622d2e390746c7b348557cdf15d3da3b5bcaba3aaefa",
  "https://github.com/coder/coder/releases/download/v2.24.3/coder_2.24.3_linux_amd64.tar.gz": "186b6198646a35b8d4b9f2d0f9a3df3c37e65e2038235f78d8dcb26c875d37e2",
  "https://github.com/coder/coder/releases/download/v2.24.3/coder_2.24.3_darwin_amd64.zip": "2cf156f2e390cd7eb3d9a851023850cd0e6323c3682bde0c3c42b31e9b5a3f99",
  "https://github.com/coder/coder/releases/download/v2.24.3/coder_2.24.3_linux_arm64.tar.gz": "6a86dc6f46988904c581ea9ee1a1cdf09eec6a49d1d015da3909b4d409c4d2ad",
  "https://github.com/coder/coder/releases/download/v2.25.1/coder_2.25.1_darwin_arm64.zip": "6c453cd8e040f15e7a50543b200e42376b3215d8a1ca3c3c7cdcaeb8efc423cd",
  "https://github.com/coder/coder/releases/download/v2.25.1/coder_2.25.1_linux_amd64.tar.gz": "2e087d312e19c146bce10e52013b34e41f1d54aaef44b2042d607663ba9d0bd9",
  "https://github.com/coder/coder/releases/download/v2.25.1/coder_2.25.1_darwin_amd64.zip": "a0b8434c2c3f8b7fbedb95d08091853db68c78d504317dcc4004dc5a4f98e8de",
  "https://github.com/coder/coder/releases/download/v2.25.1/coder_2.25.1_linux_arm64.tar.gz": "d48e86fe8ed2477b33f81c6d03c8a0b11155b2189aa1dd26a1f8624784141bc7",
  "https://github.com/coder/coder/releases/download/v2.25.2/coder_2.25.2_linux_amd64.tar.gz": "b7490407db8472d7f4ff03387ded2f6590d55f7d8458c5d38c0a43661c7f3133",
  "https://github.com/coder/coder/releases/download/v2.25.2/coder_2.25.2_darwin_amd64.zip": "49991366190ccf7445da7c3166e8db0365605eecbdd66aaa5f263e99f46340a9",
  "https://github.com/coder/coder/releases/download/v2.25.2/coder_2.25.2_linux_arm64.tar.gz": "4779c269e126c8754073167d592a2b77b65a00c882a9efb3bd6d6b9e34f21f44",
  "https://github.com/coder/coder/releases/download/v2.25.2/coder_2.25.2_darwin_arm64.zip": "ae4d8e17a86645febb163f6a0f53c1743d6da01b7362779481a96aa43641e5cd",
  "https://github.com/coder/coder/releases/download/v2.26.0/coder_2.26.0_linux_arm64.tar.gz": "58019fb6b6e3e8a8dcd5c039140bd8c4609aa2124ebf871e7aff5d35469898e2",
  "https://github.com/coder/coder/releases/download/v2.26.0/coder_2.26.0_linux_amd64.tar.gz": "da675af800396d5a312093f3a10f5bd9b3f17e5a3a3c6458e36597e7212a12bb",
  "https://github.com/coder/coder/releases/download/v2.26.0/coder_2.26.0_darwin_amd64.zip": "61ffa58821620f4291ced046d2440bcbdcb5c05000d2caf4e65bea867ff9bb3b",
  "https://github.com/coder/coder/releases/download/v2.26.0/coder_2.26.0_darwin_arm64.zip": "162708de60d667af4b5d1c02a93fe5104df929bc0e2f297414a15911d7966096",
  "https://github.com/coder/coder/releases/download/v2.25.3/coder_2.25.3_darwin_arm64.zip": "fe4c5ecb7cf85a3ab5874d634f49483605cc05164eefa85fea77d91c81aee85e",
  "https://github.com/coder/coder/releases/download/v2.25.3/coder_2.25.3_linux_arm64.tar.gz": "8117ae55675d515b531ba81d9c9afbfb7a579ee5880346a8439f6d1761fe06b3",
  "https://github.com/coder/coder/releases/download/v2.25.3/coder_2.25.3_linux_amd64.tar.gz": "69455380b249d42ba73b7979e179c0eb463b5f6c3c619caf513aa387e7f99cef",
  "https://github.com/coder/coder/releases/download/v2.25.3/coder_2.25.3_darwin_amd64.zip": "1f71a3f2a7e0a1934d24033f2121797778f651f713d917a2544e3d73fa3e23d3",
  "https://github.com/coder/coder/releases/download/v2.26.1/coder_2.26.1_linux_arm64.tar.gz": "64df7cda98bc65314e028dcee3a96c5af753c5c1ae2c9a0516921f4c208a74f0",
  "https://github.com/coder/coder/releases/download/v2.26.1/coder_2.26.1_darwin_arm64.zip": "15fd2e2f015b8b7313bfe5f9880e4fd998b01636264014402c26f9599f629d95",
  "https://github.com/coder/coder/releases/download/v2.26.1/coder_2.26.1_darwin_amd64.zip": "19b57042f2502a7e2ea51390a117fed6b95a99fb1b4525cd1e32ad6f572650c1",
  "https://github.com/coder/coder/releases/download/v2.26.1/coder_2.26.1_linux_amd64.tar.gz": "b96de42d073ce3706da31bec48aae6c95d0fe96040361c6443bc43e181a617db",
  "https://github.com/coder/coder/releases/download/v2.27.1/coder_2.27.1_darwin_arm64.zip": "50339a1be713d17eadd945f837b5a582893d3312cb0d30d9f5e63d4cc37a893f",
  "https://github.com/coder/coder/releases/download/v2.27.1/coder_2.27.1_linux_amd64.tar.gz": "064502e83f5075ec23fa7428f0e8bc062264add4a7b9de1b1470db5c2b612aa4",
  "https://github.com/coder/coder/releases/download/v2.27.1/coder_2.27.1_darwin_amd64.zip": "38f2fb15bd265211811237633ce4e1dd6e925aa381ec9bd5a2c7edffa2b44a8b",
  "https://github.com/coder/coder/releases/download/v2.27.1/coder_2.27.1_linux_arm64.tar.gz": "a0c091e61ae83bd1eaca06a4430c514e5ac98a16b63138fe810b18f161157bbc",
  "https://github.com/coder/coder/releases/download/v2.27.3/coder_2.27.3_darwin_amd64.zip": "8f8d675fb09084bb23542069eaf6b198e71b5ca5d7cff8859bf4d8d875cb5870",
  "https://github.com/coder/coder/releases/download/v2.27.3/coder_2.27.3_darwin_arm64.zip": "4cb07713597e50d56cbe0cb44d5b40d7b96a6a0b4190a03805dd926cc8d36a52",
  "https://github.com/coder/coder/releases/download/v2.27.3/coder_2.27.3_linux_amd64.tar.gz": "54602faa2a4991033ecf106116de7b55ab17fe033adbac4f469574b91ec51090",
  "https://github.com/coder/coder/releases/download/v2.27.3/coder_2.27.3_linux_arm64.tar.gz": "76c8f0652a02d9b423e199ff33b4a537cdd928c129063b3bf09e0facd1831f11",
  "https://github.com/coder/coder/releases/download/v2.27.4/coder_2.27.4_darwin_amd64.zip": "91f012ccbb6b08df0b11005c509e0074a89ae354c8305a481adb58c9255e5536",
  "https://github.com/coder/coder/releases/download/v2.27.4/coder_2.27.4_darwin_arm64.zip": "2ec164ad0ee6bdc67a6d8cdeee5ed1ba89ebed45bdc7e6af2d4db669b522fc06",
  "https://github.com/coder/coder/releases/download/v2.27.4/coder_2.27.4_linux_amd64.tar.gz": "55db39793131fa6afcbd01b7a9666e91268a3e943e4d1efe78b974cecb99d3e0",
  "https://github.com/coder/coder/releases/download/v2.27.4/coder_2.27.4_linux_arm64.tar.gz": "8602d449547d3f6b7b9c539e0a74ed0628e0cf4d904bc013efa6842a68b692ce",
  "https://github.com/coder/coder/releases/download/v2.27.6/coder_2.27.6_darwin_amd64.zip": "36c48c25d980f89093faf091294babe0f5bcbcf0444c6105000588463239aaed",
  "https://github.com/coder/coder/releases/download/v2.27.6/coder_2.27.6_darwin_arm64.zip": "11f02d21bf9cc080fd2b832e8cc01fc31f11a3e90110df1e887c76138ea9720a",
  "https://github.com/coder/coder/releases/download/v2.27.6/coder_2.27.6_linux_amd64.tar.gz": "75f3d9a5c7aeea075f9c025aaca97454b23a75ca01550fe608ff930b34eed910",
  "https://github.com/coder/coder/releases/download/v2.27.6/coder_2.27.6_linux_arm64.tar.gz": "dfc5a71a3ac3ce0b30182a8d5095eb97242f2a19ae09f4d34676c32bb9e2e27a",
  "https://github.com/coder/coder/releases/download/v2.29.1/coder_2.29.1_darwin_amd64.zip": "3b06690938c45734eee0cf637f4bceb93ba2ca7ebaa9173fa443bf0cb0fca6f8",
  "https://github.com/coder/coder/releases/download/v2.29.1/coder_2.29.1_darwin_arm64.zip": "02e345b6f9c6e344e8965fe19845de1ae57a65cc5fb95b944c5a9db532d7467f",
  "https://github.com/coder/coder/releases/download/v2.29.1/coder_2.29.1_linux_amd64.tar.gz": "2f16000d1764888b2f1c168ccbe32d26e528f29e4c2c32832faa4cb476aaa24c",
  "https://github.com/coder/coder/releases/download/v2.29.1/coder_2.29.1_linux_arm64.tar.gz": "84d3e29b0ce8a42d878fc8b423a28902dbca5c03400a999c37ea271af01a32f7",
}
