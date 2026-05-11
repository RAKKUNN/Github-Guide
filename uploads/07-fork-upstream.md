# 7장. Fork와 Upstream으로 기여하기

> **이 장을 다 읽으시면**
> - Fork가 Clone과 무엇이 다른지 설명하실 수 있습니다.
> - 오픈소스나 권한이 없는 저장소에 **Fork → PR** 흐름으로 기여하실 수 있습니다.
> - `origin` 과 `upstream` 두 개의 원격을 구분해 사용하실 수 있습니다.
> - 원본 저장소의 최신 변경을 **내 Fork 에 동기화**하실 수 있습니다.

---

## 7.1 Fork란 무엇인가요?

지금까지는 **내가 만든 저장소**에 직접 push 해 왔습니다. 그런데 대부분의 경우, **남이 만든 저장소**에는 쓰기 권한이 없습니다. 오픈소스 프로젝트, 학교의 공용 실습 저장소, 다른 학회의 자료 저장소 등이 그렇습니다.

이때 쓰는 것이 **Fork** 입니다.

> **Fork**: 남의 저장소를 **내 계정으로 통째로 복사**해 오는 GitHub 기능입니다. 복사본이기 때문에 내 것처럼 자유롭게 push 할 수 있습니다.

Fork 후의 관계는 이렇게 됩니다.

```
원본 저장소 (upstream)        # 보통 원본을 이렇게 부릅니다
  └── 내 Fork (origin)        # 내 계정 아래에 있는 복사본
        └── 내 로컬 clone      # 내 컴퓨터의 작업본
```

## 7.2 Fork vs Clone — 헷갈리지 마세요

| 구분 | Fork | Clone |
| --- | --- | --- |
| 어디서? | **GitHub 웹** (브라우저) | **내 컴퓨터** (터미널) |
| 무엇을 만드나요? | GitHub 상의 **또 다른 저장소** | 내 컴퓨터의 **로컬 복사본** |
| 언제 필요한가요? | 남의 저장소에 기여하고 싶을 때 | 원격 저장소를 내 컴퓨터로 가져올 때 |

한 문장으로 요약하자면:

> **Fork는 GitHub 안에서의 복사, Clone은 GitHub에서 내 컴퓨터로의 복사입니다.**

## 7.3 Fork 기반 기여 워크플로우 (전체 흐름)

한 눈에 보이도록 정리해 드립니다. 이 장의 나머지는 각 단계를 풀어서 설명하는 내용입니다.

```
1. 원본 저장소를 [Fork]           (GitHub 웹)
2. 내 Fork 를 git clone          (내 컴퓨터)
3. upstream 원격 추가            (내 컴퓨터)
4. 새 브랜치 생성 → 작업 → push   (내 컴퓨터 → 내 Fork)
5. 내 Fork 에서 원본으로 PR       (GitHub 웹)
6. 리뷰 받아 머지
7. upstream 에서 최신 변경 pull 해 내 Fork 동기화
```

## 7.4 단계별 실습

실습 대상은 무엇이든 상관없지만, 이 가이드에서는 가상의 저장소 `school/awesome-notes` 에 기여한다고 가정하겠습니다.

### 1단계. Fork 하기

1. 원본 저장소 (`https://github.com/school/awesome-notes`) 페이지 오른쪽 위 **Fork** 버튼을 누릅니다.
2. "Where should we fork?" 화면에서 **내 계정**을 선택합니다.
3. 잠시 후 내 계정 아래 `https://github.com/나의계정/awesome-notes` 가 만들어집니다.

### 2단계. 내 Fork 를 Clone

```bash
$ git clone git@github.com:나의계정/awesome-notes.git
$ cd awesome-notes
```

이 시점에서 원격 설정을 확인해 보세요.

```bash
$ git remote -v
origin  git@github.com:나의계정/awesome-notes.git (fetch)
origin  git@github.com:나의계정/awesome-notes.git (push)
```

`origin` 은 **내 Fork** 를 가리키고 있습니다.

### 3단계. `upstream` 원격 추가

원본을 가리킬 **두 번째 원격**을 `upstream` 이라는 이름으로 추가합니다. 이름은 관습일 뿐 다른 이름을 쓰셔도 됩니다.

```bash
$ git remote add upstream git@github.com:school/awesome-notes.git
$ git remote -v
origin    git@github.com:나의계정/awesome-notes.git (fetch)
origin    git@github.com:나의계정/awesome-notes.git (push)
upstream  git@github.com:school/awesome-notes.git (fetch)
upstream  git@github.com:school/awesome-notes.git (push)
```

> 💡 원본 저장소에 push 할 권한이 어차피 없으므로 `upstream` 으로의 push 는 거부됩니다. 보통은 **fetch/pull 전용** 으로 사용합니다.

### 4단계. 브랜치 만들고 작업

```bash
$ git switch main
$ git pull upstream main           # 원본의 최신 상태를 먼저 당겨 옴
$ git switch -c feature/chapter-3-typo
# 파일 수정
$ git add .
$ git commit -m "docs: 3장 오탈자 수정"
$ git push -u origin feature/chapter-3-typo
```

여기서 핵심은 **push 대상이 `origin`**(내 Fork) 이라는 점입니다.

### 5단계. 내 Fork 에서 원본으로 PR 보내기

1. 내 Fork 저장소 페이지로 이동합니다.
2. 상단에 **Compare & pull request** 배너가 뜹니다. 또는 **Pull requests** 탭에서 **New pull request** 를 누릅니다.
3. PR 작성 화면 상단에 네 개의 드롭다운이 있는지 확인합니다.

   | 항목 | 값 |
   | --- | --- |
   | base repository | `school/awesome-notes` |
   | base | `main` |
   | head repository | `나의계정/awesome-notes` |
   | compare | `feature/chapter-3-typo` |

4. [5장](./05-pull-request.md)에서 배운 것처럼 **좋은 제목과 본문**을 적고 PR을 생성합니다.

### 6단계. 리뷰와 머지

원본 저장소의 관리자(메인테이너)가 리뷰합니다. 요청 사항이 있으면 내 로컬 브랜치에서 수정한 뒤 다시 `origin` 으로 push 하시면 PR이 자동으로 갱신됩니다.

머지되면 원본 저장소의 역사에 **내 이름**이 남습니다. 🎉

### 7단계. 내 Fork 를 원본과 동기화

시간이 지나면 원본 저장소에는 다른 사람들의 변경도 계속 쌓입니다. 내 Fork 가 뒤처지지 않도록 주기적으로 **동기화**하셔야 합니다.

```bash
$ git switch main
$ git fetch upstream
$ git merge upstream/main
$ git push origin main
```

- `git fetch upstream` : 원본의 최신 정보를 가져오기만 합니다(아직 내 작업에는 영향 없음).
- `git merge upstream/main` : 원본의 `main` 을 내 로컬 `main` 에 반영.
- `git push origin main` : 내 Fork 의 `main` 에도 반영.

#### 더 간편한 방법 (GitHub 웹)

내 Fork 저장소 페이지 위쪽에 다음과 같은 알림이 뜨는 경우가 있습니다.

> This branch is 5 commits behind school:main.

이 알림 옆 **Sync fork → Update branch** 를 누르시면, 위 3줄의 명령을 GitHub가 대신 실행해 줍니다. 그 뒤 로컬에는 `git pull` 만 해 주시면 됩니다.

## 7.5 팀 프로젝트에서 — Fork 방식 vs 공동 작업자 방식

학부 팀 프로젝트에서는 두 방식 중 하나를 고르시면 됩니다.

### 방식 A. 공동 작업자(Collaborator) 방식 — **권장**

- 리더가 저장소를 만들고 `Settings → Collaborators` 에서 팀원 계정을 초대합니다.
- 모두가 같은 저장소에 **브랜치**를 만들어 작업하고 PR로 합칩니다.
- 장점: 세팅이 단순하고, 브랜치/이슈가 한 곳에 모여 관리가 쉽습니다.
- 단점: 모두에게 쓰기 권한이 주어지므로 실수로 `main` 에 직접 push 할 위험이 있습니다. (이는 [Branch protection rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches) 로 막을 수 있습니다.)

### 방식 B. Fork 방식

- 각자 개인 계정으로 Fork 한 뒤, 리더의 원본 저장소에 PR을 보냅니다.
- 장점: 오픈소스 협업과 동일한 패턴이라 연습이 됩니다.
- 단점: 초기 세팅이 복잡하고, 브랜치 동기화 수고가 늘어납니다.

**처음 팀 프로젝트**라면 **방식 A** 로 시작하시고, 오픈소스 기여에 도전하실 때 Fork 방식을 쓰시는 흐름을 추천드립니다.

## 7.6 오픈소스에 첫 기여해 보기 — 추천 시작점

"기여를 하고 싶은데 어떤 프로젝트가 좋을까요?" 라는 질문을 많이 받습니다. 초반에는 **코드가 아니어도** 됩니다.

- **오탈자 수정**: 공식 문서의 한국어 번역 오타 하나만 고쳐도 훌륭한 첫 PR 입니다.
- **Good first issue** 라벨: 많은 프로젝트가 신규 기여자용 이슈에 이 라벨을 붙여 둡니다. GitHub 검색창에 `label:"good first issue"` 로 찾아보세요.
- **CONTRIBUTING.md 읽기**: 저장소 최상단의 `CONTRIBUTING.md` 파일은 "이 프로젝트에 기여하려면 어떻게 해야 하는지" 안내입니다. **PR 전에 반드시 읽어 주세요**.
- **작게, 하나만**: 첫 기여는 "한 줄짜리 변경 + 깔끔한 PR 설명" 이면 충분합니다.

---

## 자주 겪는 어려움

- **"Fork 했는데 내 계정에서 안 보여요."**
  브라우저 새로고침이 반영되지 않은 경우가 많습니다. GitHub 프로필 → **Repositories** 탭에서 확인해 보세요.
- **"`git push` 했는데 원본 저장소에 안 올라가요."**
  정상입니다. Fork 방식은 **내 Fork 에만** push 되고, 원본에는 **PR** 을 통해서만 반영됩니다.
- **"`upstream` 으로 push 하려니 권한 거부가 나요."**
  원본 저장소에 쓰기 권한이 없기 때문입니다. `upstream` 은 읽기 전용으로만 사용하시면 됩니다.
- **"Fork 를 지우고 싶어요."**
  내 Fork 저장소 → **Settings** → 가장 아래 **Danger Zone** → **Delete this repository**. 원본에는 영향이 없습니다.
- **"원본이 너무 많이 앞서가서 내 브랜치에 충돌이 많아요."**
  [6장](./06-merge-conflicts.md)의 방식으로 내 브랜치에 `upstream/main` 을 merge 하면서 해결하시면 됩니다. 주기적으로 동기화해 두시는 것이 최선의 예방입니다.

## 다음 단계

기여 흐름까지 익히셨다면, 마지막으로 협업에서 빠질 수 없는 **Issue 작성법** 을 배워 보겠습니다.

👉 **다음 장**: [8장. 좋은 Issue 작성법](./08-issues.md)

관련 키워드: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `good first issue`, `upstream sync`, `mirror repository`
