document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('language-select');

    // 現在のURLパスから言語を検出
    const currentPath = window.location.pathname;
    let currentLang = 'ja'; // デフォルトは日本語

    if (currentPath.startsWith('/en/')) {
        currentLang = 'en';
    } else if (currentPath.startsWith('/zh/')) {
        currentLang = 'zh';
    }
    languageSelect.value = currentLang; // セレクタの初期値を設定

    languageSelect.addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        let newPath = '';

        // 現在のURLからファイル名を抽出 (例: /pages/flow.html -> flow.html)
        const pathSegments = currentPath.split('/');
        const fileName = pathSegments[pathSegments.length - 1] || 'index.html'; // ファイル名がない場合はindex.html

        if (selectedLanguage === 'ja') {
            // 日本語はルートまたは /pages/
            if (currentPath.startsWith('/en/') || currentPath.startsWith('/zh/')) {
                // 他言語フォルダから日本語ルートへ
                if (pathSegments[pathSegments.length - 2] === 'pages') { // 下層ページの場合
                    newPath = `/pages/${fileName}`;
                } else { // トップページの場合
                    newPath = `/`;
                }
            } else { // もともと日本語パスの場合
                newPath = currentPath;
            }
        } else {
            // 英語または中国語
            if (currentPath.startsWith('/en/') || currentPath.startsWith('/zh/')) {
                // 他言語フォルダから他の言語フォルダへ (例: /en/flow.html -> /zh/flow.html)
                newPath = `/${selectedLanguage}/${pathSegments[pathSegments.length - 2] === 'pages' ? 'pages/' : ''}${fileName}`;
            } else {
                // 日本語ルートから他言語フォルダへ (例: /index.html -> /en/index.html)
                if (currentPath.startsWith('/pages/')) { // 下層ページの場合
                    newPath = `/${selectedLanguage}/pages/${fileName}`;
                } else { // トップページの場合
                    newPath = `/${selectedLanguage}/${fileName}`;
                }
            }
        }

        // GitHub Pagesのサブディレクトリに対応するため、リポジトリ名をパスに追加
        // 例: https://[username].github.io/acleda-bank-support/
        const repoName = window.location.pathname.split('/')[1]; // acleda-bank-support を取得
        let baseUrl = `/${repoName}`;

        if (newPath === '/') {
            window.location.href = baseUrl;
        } else {
            window.location.href = `${baseUrl}${newPath}`;
        }
    });
});
