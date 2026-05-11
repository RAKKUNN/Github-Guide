# 9장. 명령어 치트시트 + 한영 용어집

> **이 장은 앞으로 책갈피로 두고 쓰실 수 있는 참고용 페이지입니다.**
> - 자주 쓰는 Git 명령어를 빠르게 찾을 수 있습니다.
> - 특정 상황에서 쓰는 레시피를 모아 두었습니다.
> - 한영 용어집으로 Git/GitHub 용어의 원어를 확인하실 수 있습니다.

---

## 9.1 자주 쓰는 Git 명령어 20선

| 명령어 | 설명 | 예시 |
| --- | --- | --- |
| `git init` | 현재 폴더를 Git 저장소로 초기화 | `git init` |
| `git clone <URL>` | 원격 저장소를 로컬로 복제 | `git clone git@github.com:user/repo.git` |
| `git status` | 현재 상태 확인 | `git status` |
| `git add <파일>` | 스테이징 영역에 추가 | `git add README.md` |
| `git add .` | 현재 폴더의 모든 변경 추가 | `git add .` |
| `git commit -m "메시지"` | 커밋 생성 | `git commit -m "feat: 기능 추가"` |
| `git commit -am "메시지"` | 추적 중인 파일 add + commit 한 번에 | `git commit -am "fix: 오탈자 수정"` |
| `git push` | 원격으로 커밋 업로드 | `git push` |
| `git push -u origin <브랜치>` | 원격 브랜치에 처음 push 하며 추적 설정 | `git push -u origin feature/login` |
| `git pull` | 원격에서 최신 변경 당겨 오기 (fetch + merge) | `git pull` |
| `git fetch` | 원격의 변경 정보만 가져오기 (반영은 안 함) | `git fetch origin` |
| `git branch` | 로컬 브랜치 목록 | `git branch` |
| `git branch -r` | 원격 브랜치 목록 | `git branch -r` |
| `git switch <브랜치>` | 브랜치 이동 | `git switch main` |
| `git switch -c <브랜치>` | 새 브랜치 만들고 이동 | `git switch -c feature/new` |
| `git merge <브랜치>` | 지금 브랜치에 다른 브랜치 합치기 | `git merge feature/login` |
| `git log --oneline` | 커밋 이력을 한 줄씩 보기 | `git log --oneline` |
| `git diff` | 아직 스테이징하지 않은 변경 보기 | `git diff` |
| `git diff --staged` | 스테이징된 변경 보기 | `git diff --staged` |
| `git remote -v` | 원격 저장소 목록 확인 | `git remote -v` |

## 9.2 상황별 빠른 레시피

### 되돌리기

| 상황 | 명령어 |
| --- | --- |
| **아직 add 하지 않은 파일 변경 취소** | `git restore <파일>` |
| **스테이징 취소 (add 되돌리기)** | `git restore --staged <파일>` |
| **마지막 커밋 메시지 수정** | `git commit --amend -m "새 메시지"` |
| **마지막 커밋 자체를 취소 (변경은 유지)** | `git reset --soft HEAD~1` |
| **마지막 커밋과 변경 모두 취소** | `git reset --hard HEAD~1` |
| **특정 시점으로 완전히 되돌리기** | `git reset --hard <해시>` |
| **머지 도중 충돌 해결 포기** | `git merge --abort` |

> ⚠️ `--hard` 옵션은 되돌릴 수 없으니, 사용 전 `git reflog` 로 해시를 확인해 두시는 것이 안전합니다.

### 임시 저장 (`stash`)

작업 중인 변경을 **일시적으로 치워 두고 싶을 때** 씁니다.

```bash
$ git stash push -m "임시 저장: 로그인 기능 절반"
$ git stash list
$ git stash pop      # 다시 꺼내기
$ git stash drop     # 버리기
```

### 로그 보기

| 명령어 | 설명 |
| --- | --- |
| `git log` | 상세 로그 |
| `git log --oneline` | 한 줄 요약 |
| `git log --graph --oneline --all` | 브랜치 그래프 포함 시각화 |
| `git reflog` | HEAD가 가리켰던 모든 위치 이력 (되돌리기용) |

### 원격 관리

| 명령어 | 설명 |
| --- | --- |
| `git remote add <이름> <URL>` | 새 원격 추가 | `git remote add upstream ...` |
| `git remote remove <이름>` | 원격 삭제 | `git remote remove upstream` |
| `git remote rename <기존> <새>` | 원격 이름 변경 | `git remote rename origin old-origin` |

### 브랜치 관리

| 명령어 | 설명 |
| --- | --- |
| `git branch -d <브랜치>` | 로컬 브랜치 삭제 (머지된 브랜치만) |
| `git branch -D <브랜치>` | 로컬 브랜치 강제 삭제 (머지 여부 무시) |
| `git push origin --delete <브랜치>` | 원격 브랜치 삭제 |
| `git branch -m <새이름>` | 현재 브랜치 이름 변경 |

## 9.3 한영 용어집

Git과 GitHub에서 자주 쓰이는 용어를 정리했습니다. 영어 문서를 읽을 때 참고하세요.

| 한국어 | 영어 | 설명 |
| --- | --- | --- |
| 저장소 | Repository, repo | 프로젝트 하나를 담는 폴더 단위 |
| 커밋 | Commit | 변경 이력의 한 지점(스냅샷) |
| 브랜치 | Branch | 이력의 갈라진 가지 |
| 병합 | Merge | 브랜치를 합치는 작업 |
| 리베이스 | Rebase | 커밋을 다른 베이스로 옮기는 작업 |
| 푸시 | Push | 로컬 → 원격 업로드 |
| 풀 | Pull | 원격 → 로컬 내려받기 |
| 클론 | Clone | 원격 저장소를 처음 복제 |
| 포크 | Fork | 원격 저장소를 내 계정으로 복제 |
| 업스트림 | Upstream | 원본 저장소를 가리키는 원격 이름 |
| 오리진 | Origin | 복제해 온 원격의 기본 이름 |
| 해시 | Hash | 커밋의 고유 식별자 (예: `a1b2c3d`) |
| HEAD | HEAD | 현재 내가 서 있는 브랜치/커밋 |
| 스테이징 영역 | Staging area / index | 커밋 전 준비 공간 |
| 워킹 디렉터리 | Working directory | 실제 파일이 있는 폴더 |
| 체크아웃 | Checkout | 브랜치/커밋 이동 (최신에는 `switch`가 많이 쓰임) |
| 리모트 | Remote | 원격 저장소 |
| 풀 리퀘스트 | Pull Request, PR | 브랜치 합치기 요청 |
| 이슈 | Issue | 버그·기능·할 일 기록 |
| 태그 | Tag | 특정 커밋에 붙이는 이름 (예: `v1.0.0`) |
| 리셋 | Reset | 특정 시점으로 되돌리기 |
| 리버트 | Revert | 이전 커밋을 취소하는 **새 커밋** 만들기 |
| 스태시 | Stash | 임시 저장 |
| 충돌 | Conflict | 병합 시 같은 줄이 다르게 바뀐 상태 |
| 병합 커밋 | Merge commit | 브랜치 합침 기록 |
| 패스트 포워드 | Fast-forward | 병합 시 단순히 브랜치 포인터만 옮김 |
| 라벨 | Label | 이슈/PR의 분류 꼬리표 |
| 마일스톤 | Milestone | 특정 시점의 이슈 묶음 |
| 어사인 | Assignee | 이슈/PR 담당자 |
| 리뷰어 | Reviewer | PR 리뷰를 하는 사람 |
| 컨벤션 | Convention | 약속된 규칙 (예: 커밋 메시지 형식) |
| CLI | Command Line Interface | 터미널 기반 인터페이스 |
| GUI | Graphical User Interface | 마우스 기반 인터페이스 |
| 2FA | Two-Factor Authentication | 2단계 인증 |

## 9.4 추가 학습 리소스

이 가이드를 다 읽으신 뒤에 더 깊이 파고들고 싶으시다면 다음 자료를 추천합니다.

### 한국어 자료

- **"Pro Git" 한국어 번역판**: Git의 거의 모든 기능을 다루는 공식 도서. [`git-scm.com/book/ko/v2`](https://git-scm.com/book/ko/v2)
- **GitHub 공식 한국어 문서**: [`docs.github.com/ko`](https://docs.github.com/ko)
- **"Hello, GitHub!" (책)**: 김준영 저, 비제이퍼블릭. 입문용 책을 찾으신다면 추천합니다.
- **유튜브**: "깃허브 입문", "git 강의" 로 검색하시면 많은 영상이 있습니다. 시각적 이해에 도움이 됩니다.

### 영어 자료 (실력이 늘면 도전해 보세요)

- **GitHub Learning Lab**: 인터랙티브 튜토리얼. [`lab.github.com`](https://lab.github.com)
- **GitHub Skills**: 실습 기반 학습 과정. [`skills.github.com`](https://skills.github.com)
- **"Oh Shit, Git!?!?"**: 실수했을 때 빠르게 대처하는 치트시트. [`ohshitgit.com`](https://ohshitgit.com)

## 9.5 마무리하며

이 가이드를 따라 오시면서 **Git과 GitHub가 더 이상 무섭지 않게** 느껴지셨기를 바랍니다. 처음에는 명령어도 헷갈리고 충돌도 당황스럽지만, 몇 번 쓰다 보면 손에 익습니다.

마지막으로 몇 가지 꿀팁을 정리해 드립니다.

- **매일 한 번씩 쓰세요**: 실습용 저장소를 하나 만들어 두고, 매일 아침 `git status` 와 `git log --oneline` 을 찍어 보세요.
- **팀 프로젝트에서 꼭 쓰세요**: 이 가이드를 읽었다고 바로 오픈소스에 기여할 필요는 없습니다. 팀 과제부터 브랜치·PR·Issue를 써 보세요.
- **에러 메시지를 두려워하지 마세요**: Git의 에러 메시지는 상세합니다. 그대로 복사해서 검색하시면 해결책이 바로 나옵니다.

혼자 끙끙대지 마시고, 팀원과 질문·토론하면서 함께 익혀 가시면 훨씬 빠릅니다.

그럼, 여러분의 GitHub 여정을 응원합니다! 🚀

---

**이 가이드에 오탈자나 개선 제안이 있으시다면, 저장소의 Issues 탭에 남겨 주세요.**
