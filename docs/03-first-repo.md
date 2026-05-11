# 3장. 첫 저장소 만들고 `clone` → `commit` → `push` 하기

> **이 장을 다 읽으시면**
> - GitHub 웹에서 새 저장소(repository)를 만들 수 있습니다.
> - 저장소를 내 컴퓨터로 복제(`clone`)해 올 수 있습니다.
> - `status → add → commit → push` 4단계 흐름을 손에 익히게 됩니다.
> - 커밋 메시지를 "미래의 나와 팀원이 읽을 만하게" 쓰는 감을 잡게 됩니다.
> - `.gitignore` 로 올리면 안 되는 파일을 거르실 수 있습니다.

---

## 3.1 GitHub에서 새 저장소 만들기

1. 로그인 후 오른쪽 위 **+** → **New repository** 를 클릭합니다.
2. 항목을 아래처럼 채웁니다.

| 항목 | 추천 값 | 설명 |
| --- | --- | --- |
| **Repository name** | `hello-github` | 영문 소문자 + 하이픈(`-`) 조합이 가장 안전합니다. 한글은 피해 주세요. |
| **Description** | `나의 첫 깃허브 실습 저장소` | 짧은 한 줄 설명. 나중에 추가해도 됩니다. |
| **Public / Private** | 실습용은 `Public` 으로도 충분합니다. 민감한 코드라면 `Private`. |
| **Add a README file** | ✅ 체크 | 저장소 설명 파일이 자동으로 생깁니다. |
| **Add .gitignore** | **언어 선택** (예: Python, Node) 또는 건너뛰기 | 언어에 맞춰 불필요한 파일을 미리 걸러 줍니다. |
| **Choose a license** | `MIT License` (오픈 실습용) 또는 선택 안 함 | 남들이 내 코드를 쓸 수 있는 조건을 정합니다. |

3. **Create repository** 를 누르면 완성입니다. URL은 `https://github.com/사용자명/hello-github` 형태가 됩니다.

> 💡 **Public? Private? 고민되시면?** 과제 코드는 다른 학생이 복사할 수 있으니 **Private** 으로 두시고, 포트폴리오로 보여 주실 시점에 Public으로 바꾸시는 것을 추천합니다. 공개/비공개는 `Settings → General → Danger Zone` 에서 언제든 바꾸실 수 있습니다.

## 3.2 저장소를 내 컴퓨터로 `clone` 하기

방금 만든 저장소 페이지의 초록색 **Code** 버튼을 누르시면, 복제할 주소가 나옵니다. [2장](./02-setup.md)에서 SSH 키를 설정하셨다면 **SSH** 탭을 골라 주세요.

```
git@github.com:사용자명/hello-github.git
```

주소를 복사하신 뒤 터미널에서 **작업 폴더**로 이동하고 `clone` 합니다.

**macOS / Linux**

```bash
$ cd ~/Documents
$ git clone git@github.com:사용자명/hello-github.git
$ cd hello-github
```

**Windows (Git Bash 또는 PowerShell)**

```bash
$ cd ~/Documents
$ git clone git@github.com:사용자명/hello-github.git
$ cd hello-github
```

이제 현재 폴더가 **Git 저장소**가 되었습니다. 숨김 폴더 `.git` 이 있어서 이력이 추적됩니다. 실수로 `.git` 폴더를 지우시면 모든 이력이 사라지니 주의하세요.

현재 상태를 확인하는 명령은 다음과 같습니다.

```bash
$ git status
$ git log --oneline
```

- `git status` : 지금 어떤 파일이 바뀌었는지, 커밋할 준비가 됐는지 요약해 줍니다.
- `git log --oneline` : 지금까지의 커밋을 한 줄씩 보여 줍니다.

## 3.3 파일을 수정하고 커밋해 보기

`README.md` 를 열어 자기소개를 한 줄 추가해 봅시다. VS Code로 폴더를 여시려면:

```bash
$ code .
```

(또는 VS Code에서 `File → Open Folder` 로 폴더를 선택하셔도 됩니다.)

`README.md` 에 아래 같은 줄을 더해 주세요.

```markdown
# hello-github

나의 첫 깃허브 실습 저장소입니다.

## About me
- 이름: 김지우
- 학과: 컴퓨터공학과 25학번
- 좋아하는 언어: Python
```

저장 후 터미널에서 `git status` 를 실행하시면 이렇게 나올 것입니다.

```
On branch main
Changes not committed:
  modified:   README.md
```

"수정은 했지만, 아직 저장소에 기록할 준비는 안 됐다"는 뜻입니다.

### 3단계 흐름: `add` → `commit` → `push`

Git은 **스테이징(staging)** 이라는 중간 단계를 둡니다. 비유하자면 "장바구니에 담은 뒤 → 결제"하는 것과 같습니다.

```bash
$ git add README.md
$ git commit -m "docs: README에 자기소개 추가"
$ git push
```

- `git add <파일>` : "이 파일을 다음 커밋에 포함시켜 주세요." (장바구니에 담기)
- `git commit -m "메시지"` : 장바구니에 담긴 변경을 **한 덩어리의 이력**으로 기록합니다. (결제 완료)
- `git push` : 로컬에 쌓인 커밋을 **GitHub에 업로드**합니다. (서버에 반영)

### 자주 쓰는 단축 표현

```bash
$ git add .                                # 현재 폴더의 변경된 모든 파일 추가
$ git commit -am "fix: 오탈자 수정"         # 추적 중인 파일을 add + commit 한 번에
```

`git commit -am` 은 **이미 Git이 추적하고 있는 파일**만 자동으로 담습니다. 새로 만든 파일은 `git add` 로 따로 담아 주셔야 합니다.

`push` 까지 마치신 뒤 GitHub 저장소 페이지를 새로고침 해 보세요. 방금 쓴 커밋 메시지와 함께 `README.md` 가 업데이트되어 있을 것입니다. 🎉

## 3.4 커밋 메시지 잘 쓰는 법

커밋 메시지는 **미래의 나**와 **팀원**이 읽습니다. `update`, `수정`, `ㅇ` 같은 메시지는 두 달 뒤의 본인을 고통스럽게 만듭니다.

### 초보 단계에서 권장드리는 형식

```
<타입>: <50자 이내 요약>

<필요하면 본문 — 왜 고쳤는지, 어떤 영향이 있는지>
```

자주 쓰는 타입 예시입니다.

| 타입 | 의미 | 예시 |
| --- | --- | --- |
| `feat` | 새로운 기능 추가 | `feat: 회원가입 화면 추가` |
| `fix` | 버그 수정 | `fix: 로그인 시 빈 비밀번호 허용 문제 수정` |
| `docs` | 문서 변경 | `docs: README에 설치 방법 추가` |
| `style` | 코드 스타일(공백, 세미콜론 등) | `style: 들여쓰기 2칸 → 4칸` |
| `refactor` | 기능 변화 없는 리팩터링 | `refactor: 로그인 로직 함수 분리` |
| `test` | 테스트 코드 | `test: 비밀번호 검증 테스트 추가` |
| `chore` | 설정 파일, 빌드 등 | `chore: .gitignore에 .DS_Store 추가` |

> 📝 이 형식을 **Conventional Commits** 라고 부릅니다. 모든 팀이 쓰지는 않지만, 익혀 두시면 대부분의 오픈소스 프로젝트에서 바로 통합니다.

### 좋은 예 vs 나쁜 예

| 나쁜 예 | 좋은 예 |
| --- | --- |
| `수정` | `fix: 파일 업로드 시 한글 파일명 깨지는 문제 수정` |
| `다시 push` | `docs: 오탈자 수정 (과제 → 작업)` |
| `final_v2` | `feat: 과제 채점 스크립트 추가` |

## 3.5 `.gitignore` — 올리면 안 되는 파일 걸러 내기

저장소에 **모든 파일**을 올려야 하는 것은 아닙니다. 오히려 올리시면 안 되는 파일이 많습니다.

- 운영체제가 만드는 파일: `.DS_Store` (macOS), `Thumbs.db` (Windows)
- 에디터가 만드는 설정: `.vscode/`, `.idea/`
- 의존성 폴더: `node_modules/`, `venv/`, `__pycache__/`
- 비밀 정보: `.env`, API 키가 든 설정 파일

이런 파일을 Git이 **처음부터 무시**하도록 `.gitignore` 파일을 만들어 둡니다. 저장소 최상단에 `.gitignore` 를 만드시고, 제외할 경로를 한 줄에 하나씩 적어 주세요.

```gitignore
# OS 파일
.DS_Store
Thumbs.db

# 에디터 설정
.vscode/
.idea/

# 파이썬
__pycache__/
*.pyc
venv/

# 노드
node_modules/

# 환경 변수
.env
```

> 🧭 **꿀팁**: [`https://www.toptal.com/developers/gitignore`](https://www.toptal.com/developers/gitignore) 에서 언어·도구 이름(예: `Python`, `Node`, `VisualStudioCode`, `macOS`)을 입력하시면 잘 정리된 `.gitignore` 템플릿이 자동 생성됩니다. 복사해 붙여 넣기만 하시면 됩니다.

이미 커밋되어 올라간 파일을 `.gitignore` 에 추가해도 **이미 올라간 파일은 계속 추적**됩니다. 추적을 멈추려면:

```bash
$ git rm --cached <파일명>
$ git commit -m "chore: <파일명> 추적 중단"
```

## 3.6 GitHub 웹에서도 커밋할 수 있습니다

터미널이 아직 어색하시다면, GitHub 웹의 파일 편집 기능을 써 보셔도 됩니다.

1. 저장소에서 편집할 파일을 엽니다.
2. 오른쪽 위 **연필 아이콘** 을 누릅니다.
3. 내용을 수정한 뒤 아래쪽 **Commit changes** 박스에 메시지를 적고 초록색 버튼을 누릅니다.

이 경우 `push` 까지 자동으로 이루어지지만, 로컬에 변경이 있었다면 `git pull` 로 먼저 당겨 오셔야 합니다.

---

## 자주 겪는 어려움

- **"`git push` 했더니 `Updates were rejected` 라고 나와요."**
  원격에 내가 모르는 커밋이 생겼을 때 나옵니다. 먼저 `git pull` 로 당겨 오신 뒤 다시 `git push` 해 주세요.
- **"실수로 너무 큰 파일을 커밋해서 `push` 가 안 돼요."**
  GitHub는 100MB 이상의 파일을 거부합니다. 해당 파일을 `.gitignore` 에 넣고 `git rm --cached` 로 추적을 멈춘 뒤 다시 커밋하세요. 이미 이력에 남아 있다면 `git filter-repo` 같은 도구가 필요하지만, 초반에는 차라리 저장소를 다시 만드시는 편이 빠릅니다.
- **"커밋 메시지를 실수로 잘못 썼어요."**
  마지막 커밋이라면 `git commit --amend -m "새 메시지"` 로 고칠 수 있습니다. **이미 push 한 커밋**이라면 팀원과 상의 없이 고치지 마세요. 이력이 꼬일 수 있습니다.
- **"`fatal: not a git repository` 라고 떠요."**
  `.git` 폴더가 있는 폴더(`hello-github/`) 안에서 명령을 실행하셔야 합니다. `pwd` 로 현재 위치를 확인해 보세요.

## 다음 단계

혼자 작업하는 흐름은 이제 몸에 익으셨습니다. 이제부터는 **여러 명이 함께** 일하기 위한 도구인 브랜치로 넘어갑니다.

👉 **다음 장**: [4장. 브랜치로 안전하게 일하기](./04-branches.md)

관련 키워드: `git log`, `git diff`, `git restore`, `Conventional Commits`, `Markdown 문법`
