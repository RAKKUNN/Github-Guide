# 2장. 계정·Git·VS Code·SSH 키 설정하기

> **이 장을 다 읽으시면**
> - GitHub 계정을 학교 이메일로 안전하게 만드실 수 있습니다.
> - Windows 또는 macOS에 Git을 설치하고 초기 설정(`user.name`, `user.email`)을 마치실 수 있습니다.
> - VS Code에서 Git을 편하게 쓰기 위한 확장을 설치하실 수 있습니다.
> - SSH 키를 만들어 GitHub에 등록하고, 비밀번호 없이 안전하게 소통하실 수 있습니다.

이번 장은 분량이 조금 많습니다. 한 번에 다 하기 버거우시면, **2.1~2.2(계정·설치)** 만 먼저 끝내시고 3장으로 넘어가셔도 됩니다. SSH 키는 나중에 돌아와서 설정하셔도 괜찮습니다.

---

## 2.1 GitHub 계정 만들기

1. [`https://github.com`](https://github.com) 에 접속하셔서 **Sign up** 을 누릅니다.
2. **이메일 주소**를 입력합니다.
   - 학교 이메일(예: `@*.ac.kr`)을 쓰시면 **GitHub Student Developer Pack** 같은 학생 혜택을 신청할 수 있습니다.
   - 학교 이메일과 개인 이메일을 **둘 다 등록**해 두셔도 됩니다. 졸업 후에도 계정을 잃지 않으려면 개인 이메일을 주 이메일로 두시는 편이 좋습니다.
3. **비밀번호**는 15자 이상으로 길게 잡아 주세요.
4. **사용자명(username)** 은 **실명 기반의 짧은 영문**을 추천드립니다. 이 이름은 나중에 URL(`github.com/사용자명`)에 그대로 노출됩니다.
   - 나쁜 예: `xXbunny99Xx`, `학교이름_김학생`
   - 좋은 예: `jiwoo-kim`, `kimjw`, `sanghun-park`
5. 이메일 인증까지 끝내시면 가입 완료입니다.

> 🔐 **꼭 켜 두세요**: 가입 직후 **2단계 인증(2FA, Two-Factor Authentication)** 을 설정하세요.  `Settings → Password and authentication → Two-factor authentication` 에서 인증 앱(Google Authenticator, 1Password 등)을 연결하시면 됩니다. GitHub는 2023년부터 기여자에게 2FA를 요구하기 때문에 언젠가 반드시 하셔야 합니다.

## 2.2 Git 설치하기

### macOS

터미널(`Terminal.app` 또는 iTerm)을 여시고 다음을 실행합니다.

```bash
$ git --version
```

명령어가 **이미 있는 경우**(`git version 2.xx.x` 라고 나오는 경우)는 그대로 2.3으로 넘어가시면 됩니다. 없다면 두 가지 방법 중 편한 쪽을 고르세요.

**방법 A: Xcode Command Line Tools (가장 간단)**

```bash
$ xcode-select --install
```

팝업이 뜨면 **설치(Install)** 를 눌러 주세요. 약 5~10분 걸립니다.

**방법 B: Homebrew (다른 개발 도구도 같이 관리하고 싶다면)**

Homebrew가 없으시다면 먼저 [`https://brew.sh`](https://brew.sh) 의 설치 명령을 실행하시고, 그다음에 아래를 실행합니다.

```bash
$ brew install git
```

설치가 끝난 뒤 `git --version` 으로 확인해 주세요.

### Windows

1. [`https://git-scm.com/download/win`](https://git-scm.com/download/win) 에서 설치 파일을 내려받습니다.
2. 설치 마법사는 **기본값으로 계속 "Next"** 를 눌러도 대부분 문제가 없습니다. 다만 아래 세 가지 항목은 확인해 주세요.

| 화면 제목 | 추천 선택 | 이유 |
| --- | --- | --- |
| **Default editor used by Git** | `Use Visual Studio Code as Git's default editor` | 커밋 메시지 편집이 익숙한 VS Code로 열립니다. |
| **Adjusting your PATH environment** | `Git from the command line and also from 3rd-party software` | PowerShell이나 VS Code 터미널에서도 `git` 이 동작합니다. |
| **Choosing the SSH executable** | `Use bundled OpenSSH` | 기본값 그대로 두시면 됩니다. |

설치가 끝나면 **Git Bash** 라는 프로그램이 시작 메뉴에 생깁니다. Git Bash를 여시고 다음을 실행하세요.

```bash
$ git --version
```

버전이 출력되면 성공입니다.

## 2.3 Git 초기 설정

Git에게 **"누가 이 커밋을 했는지"** 알려 주어야 합니다. 이 정보는 커밋에 영구히 남으니 신중하게 적어 주세요.

```bash
$ git config --global user.name "Jiwoo Kim"
$ git config --global user.email "your-email@example.com"
```

- `user.name` 은 실명이나 깃허브 username을 쓰시면 됩니다.
- `user.email` 은 **GitHub에 등록한 이메일과 동일**하게 맞춰 주세요. 그래야 깃허브 프로필에 잔디(기여 그래프)가 쌓입니다.

이어서 몇 가지 실용적인 기본값을 함께 설정해 두면 편합니다.

```bash
$ git config --global init.defaultBranch main
$ git config --global pull.rebase false
$ git config --global core.autocrlf input     # macOS / Linux
$ git config --global core.autocrlf true      # Windows
```

- `init.defaultBranch main` : 새 저장소의 기본 브랜치 이름을 `main` 으로 통일합니다. (과거에는 `master` 였습니다.)
- `pull.rebase false` : `git pull` 시 기본 동작을 명시합니다. 초반에는 `false`(merge 방식)가 이해하기 쉽습니다.
- `core.autocrlf` : 운영체제별 줄바꿈 문자 차이를 Git이 알아서 처리하게 합니다.

현재 설정을 확인하시려면 다음을 실행하세요.

```bash
$ git config --global --list
```

## 2.4 VS Code 설치와 Git 친화 설정

이 가이드는 기본 에디터로 **Visual Studio Code** 를 가정합니다.

1. [`https://code.visualstudio.com`](https://code.visualstudio.com) 에서 내려받아 설치합니다.
2. VS Code를 여시고, 왼쪽 사이드바에서 확장(Extensions, `Ctrl/Cmd + Shift + X`)을 여신 뒤 다음을 설치하시면 좋습니다.

| 확장 이름 | 설명 |
| --- | --- |
| **GitLens — Git supercharged** | 각 줄이 언제·누구에 의해 바뀌었는지 보여 줍니다. |
| **Git Graph** | 커밋 이력을 시각적 그래프로 볼 수 있습니다. |
| **Korean Language Pack** | VS Code UI를 한국어로 보고 싶으시다면. |

VS Code에는 이미 Git 통합이 내장되어 있어, 좌측 사이드바의 **Source Control** 아이콘(나뭇가지 모양)으로 변경 사항을 보고 커밋할 수 있습니다. 3장에서 직접 해 보겠습니다.

**터미널이 켜져 있지 않다면** 메뉴의 `터미널 → 새 터미널 (Terminal → New Terminal)` 또는 단축키 `` Ctrl + ` `` 로 VS Code 안에서 터미널을 바로 쓰실 수 있습니다.

## 2.5 SSH 키 만들고 GitHub에 등록하기

SSH 키는 **비밀번호 대신 쓰는 더 안전한 신분증**입니다. 한 번 설정해 두시면 `git push` 할 때마다 비밀번호를 입력할 필요가 없어집니다.

### 1) 기존 키가 있는지 확인

```bash
$ ls -al ~/.ssh
```

`id_ed25519`, `id_ed25519.pub` 또는 `id_rsa`, `id_rsa.pub` 같은 파일이 이미 있다면 새로 만들지 않으셔도 됩니다. 이 경우 **3단계**(GitHub에 공개키 올리기)로 바로 가시면 됩니다.

### 2) 새 키 생성 (Windows·macOS 공통)

Git Bash(Windows) 또는 Terminal(macOS)에서 아래 명령을 실행합니다. 이메일은 **GitHub에 등록한 이메일** 그대로 입력해 주세요.

```bash
$ ssh-keygen -t ed25519 -C "your-email@example.com"
```

- 저장 경로를 묻는 질문은 **Enter** 로 기본값(`~/.ssh/id_ed25519`) 을 받아 주세요.
- 비밀번호(passphrase)는 비워 두셔도 되고, 보안을 위해 기억하기 쉬운 문구를 넣으셔도 됩니다.

만드시면 `~/.ssh/id_ed25519` (비공개 키)와 `~/.ssh/id_ed25519.pub` (공개 키) 두 파일이 생깁니다. **`.pub` 이 붙은 쪽만** GitHub에 올리시면 됩니다. 비공개 키는 **절대 누구에게도 공유하지 마세요**.

### 3) 공개 키 복사

**macOS**

```bash
$ pbcopy < ~/.ssh/id_ed25519.pub
```

**Windows (Git Bash)**

```bash
$ cat ~/.ssh/id_ed25519.pub | clip
```

**그 외 공통 방법 (눈으로 보고 복사)**

```bash
$ cat ~/.ssh/id_ed25519.pub
```

`ssh-ed25519 AAAA...` 로 시작해 이메일로 끝나는 **한 줄 전체**를 복사합니다.

### 4) GitHub에 등록

1. GitHub 웹에서 오른쪽 위 프로필 사진 → **Settings** 로 들어갑니다.
2. 왼쪽 메뉴에서 **SSH and GPG keys** → **New SSH key** 를 누릅니다.
3. **Title** 에는 어떤 기기인지 알아보기 쉬운 이름을 적습니다. (예: `MacBook Air 2024`, `집 Windows PC`)
4. **Key type** 은 기본값 `Authentication Key` 그대로 둡니다.
5. **Key** 칸에 방금 복사한 공개 키를 붙여 넣고 **Add SSH key** 를 누릅니다.

### 5) 연결 테스트

```bash
$ ssh -T git@github.com
```

처음 실행하시면 "The authenticity of host 'github.com' can't be established..." 같은 경고가 뜹니다. `yes` 를 입력해 주세요.

성공 메시지 예시는 다음과 같습니다.

```
Hi jiwoo-kim! You've successfully authenticated, but GitHub does not provide shell access.
```

이 메시지가 나오면 준비는 완벽히 끝난 것입니다.

## 2.6 HTTPS vs SSH — 어떤 걸 써야 하나요?

저장소 주소에는 두 가지 형태가 있습니다.

- HTTPS: `https://github.com/사용자명/저장소.git`
- SSH: `git@github.com:사용자명/저장소.git`

| 항목 | HTTPS | SSH |
| --- | --- | --- |
| 초기 설정 | 간단 | 키 생성·등록 필요 |
| 매번 인증 | **Personal Access Token** 필요 | 키만 있으면 자동 |
| 회사/학교 방화벽 | 대부분 열려 있음 | 가끔 막혀 있음 |

**추천**: 개인 노트북이라면 **SSH**. 공용 컴퓨터나 방화벽이 까다로운 환경이라면 **HTTPS**. 이 가이드는 SSH 기준으로 진행합니다.

---

## 자주 겪는 어려움

- **"`ssh: command not found` 가 떠요."**
  Windows에서 **cmd.exe** 대신 **Git Bash** 를 열어 주세요. macOS에서는 기본 설치되어 있습니다.
- **"`Permission denied (publickey)` 로 거부돼요."**
  1) `.pub` 파일 내용을 **한 줄 전체** 복사하셨는지, 2) GitHub 등록 시 엔터가 포함되지 않았는지, 3) `ssh -T git@github.com` 으로 계정이 맞게 인식되는지 확인해 보세요.
- **"`user.email` 을 실수로 다른 이메일로 설정했어요."**
  지금부터 나올 새 커밋만 새 이메일로 기록되고, 이미 만든 커밋은 그대로 남습니다. `git config --global --edit` 로 수정하신 뒤 새 커밋부터 반영하시면 됩니다.
- **"회사/학교 네트워크에서 SSH가 막혀요."**
  HTTPS + Personal Access Token(Settings → Developer settings → Personal access tokens)을 쓰시거나, 집 네트워크에서 다시 시도해 보세요.

## 다음 단계

이제 도구가 준비되었으니, 드디어 **첫 번째 저장소**를 만들어 볼 차례입니다.

👉 **다음 장**: [3장. 첫 저장소 만들고 clone → commit → push 하기](./03-first-repo.md)

관련 키워드: `Personal Access Token`, `2FA`, `~/.gitconfig`, `ssh-agent`
