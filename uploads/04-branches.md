# 4장. 브랜치로 안전하게 일하기

> **이 장을 다 읽으시면**
> - 브랜치(branch)가 왜 필요한지 비유로 설명하실 수 있습니다.
> - `git branch`, `git switch`, `git merge` 기본 명령을 구분해 쓰실 수 있습니다.
> - 팀 프로젝트에서 안전한 **기능 브랜치 전략(feature branch workflow)** 을 적용하실 수 있습니다.
> - 원격(remote) 브랜치에 처음 `push` 할 때의 `-u` 옵션 의미를 이해하시게 됩니다.

---

## 4.1 왜 브랜치가 필요한가요?

공동 노트를 구글 드라이브에 두고 세 명이 동시에 같은 줄을 고치는 상황을 떠올려 보세요. 누군가의 수정이 다른 사람의 수정을 덮어쓰기 쉽고, "기능을 실험만 해 보려 했는데 원본이 망가졌다" 같은 일도 벌어집니다.

Git의 **브랜치**는 이 문제를 이렇게 해결합니다.

> 본 줄기(`main`)는 그대로 두고, **같은 시점에서 가지를 하나 쳐서** 그 위에서 작업합니다. 작업이 끝나 검증되면 본 줄기로 **합칩니다(merge)**.

덕분에 다음과 같은 일이 가능해집니다.

- 새 기능을 실험하다가 망해도 본 줄기는 안전합니다.
- 여러 사람이 **동시에 다른 기능**을 개발할 수 있습니다.
- 기능 단위로 묶어서 **코드 리뷰**를 받을 수 있습니다. (5장에서 다룹니다.)

### 머릿속에 그려 볼 그림

```
main        o---o---o---------o   (계속 배포되는 안정 버전)
                     \       /
feature/login         o---o-o     (내가 로그인 기능을 개발 중인 가지)
```

`feature/login` 가지에서 커밋을 쌓다가, 다 되면 다시 `main` 에 합칩니다.

## 4.2 브랜치 기본 명령

현재 저장소에 어떤 브랜치가 있는지 확인:

```bash
$ git branch
* main
```

`*` 표시가 **지금 내가 서 있는 브랜치**를 뜻합니다.

### 새 브랜치 만들고 이동하기

```bash
$ git switch -c feature/login
```

- `switch` : 브랜치를 전환하는 명령 (예전에는 `checkout` 을 썼습니다)
- `-c` : `create`, 새로 만들면서 이동하라는 뜻

한 번에 말고 따로 쓸 수도 있습니다.

```bash
$ git branch feature/login   # 만들기만
$ git switch feature/login   # 이동
```

### 브랜치 이름 짓는 요령

| 목적 | 추천 이름 |
| --- | --- |
| 새 기능 | `feature/로그인-화면`, `feature/42-signup` |
| 버그 수정 | `fix/로그인-오류`, `fix/123-null-pointer` |
| 문서 작업 | `docs/readme-설치법` |
| 실험 | `experiment/빠른-검색` |

추천 규칙은 다음과 같습니다.

- **영문 소문자 + 하이픈(-)** 을 기본으로 (한글은 피해 주세요)
- `슬래시(/)` 로 **카테고리/내용** 구분
- 이슈 번호(뒷장에서 다룹니다)가 있다면 `feature/42-...` 처럼 붙이면 추적이 편합니다.

### 브랜치 사이를 오가기

```bash
$ git switch main            # main 으로 이동
$ git switch feature/login   # 다시 작업 브랜치로
```

이동할 때 **저장되지 않은 변경 사항**이 있다면 Git이 경고합니다. 커밋을 먼저 하시거나, 임시 보관하려면 `git stash` 를 이용하시면 됩니다.

### 브랜치 삭제

작업이 끝난 뒤 더 이상 필요 없는 로컬 브랜치를 지웁니다.

```bash
$ git switch main
$ git branch -d feature/login
```

**머지되지 않은** 브랜치를 억지로 지우시려면 `-D`(대문자)를 쓰시는데, 실수로 작업을 날릴 수 있으니 신중해야 합니다.

## 4.3 원격(remote) 브랜치와 `-u` 옵션

로컬에서 만든 브랜치는 **내 컴퓨터에만** 있습니다. 팀원이 볼 수 있게 하려면 **원격(GitHub)** 에 밀어 올려야 합니다.

처음 push 할 때는 `-u`(`--set-upstream`) 옵션을 붙입니다.

```bash
$ git push -u origin feature/login
```

- `origin` : 원격 저장소의 기본 이름. `git clone` 하면 자동으로 이 이름이 붙습니다.
- `-u` : "앞으로 이 로컬 브랜치는 저 원격 브랜치를 기본으로 따라간다"고 기억시키는 옵션입니다.

이후부터는 그냥 `git push`, `git pull` 로도 자동 연결됩니다.

원격 브랜치 목록을 보려면:

```bash
$ git branch -r           # 원격 브랜치만
$ git branch -a           # 로컬 + 원격 모두
```

원격 브랜치가 더 이상 필요 없다면 삭제도 가능합니다.

```bash
$ git push origin --delete feature/login
```

## 4.4 브랜치 합치기 (`merge`)

작업이 끝난 `feature/login` 을 `main` 에 합치려면, **받는 쪽 브랜치에 서서** merge 합니다.

```bash
$ git switch main
$ git pull                       # main 최신 상태로 갱신 (팀원의 변경을 먼저 당겨옵니다)
$ git merge feature/login
$ git push
```

> 📌 실무·팀 프로젝트에서는 **로컬에서 직접 merge** 하지 않고 **Pull Request**(5장)로 합칩니다. 이 장은 개념 이해를 위해 로컬 merge를 먼저 설명드리는 것입니다.

### Fast-forward vs Merge commit

- **Fast-forward**: `main` 이 그동안 멈춰 있었다면, Git은 그냥 `main` 이라는 라벨을 앞으로 옮기기만 합니다. 이력이 깔끔합니다.
- **Merge commit**: `main` 도 그사이 앞으로 나갔다면, 두 줄기를 합치는 **병합 커밋**이 하나 생깁니다. 이력에 Y자 모양이 남습니다.

초반에는 둘 중 무엇이 일어나든 크게 신경 쓰지 않으셔도 됩니다. 시간이 지나 `git log --graph --oneline --all` 로 이력을 살펴보시면 모양이 눈에 들어옵니다.

## 4.5 실전 팁: 신입생용 최소 전략

혼자 실습 중이거나 2~4명 팀 과제라면, 이 정도 전략이면 충분합니다.

1. `main` 은 **언제나 동작하는 버전**을 유지합니다. `main` 에서 바로 커밋하지 않는 습관을 들이세요.
2. 작업을 시작할 때마다 **새 브랜치**를 땁니다.
   ```bash
   $ git switch main
   $ git pull
   $ git switch -c feature/내-기능
   ```
3. 작업 중에는 자주 커밋하고 자주 `git push` 합니다. (컴퓨터가 갑자기 고장 나도 안심)
4. 완성되면 **Pull Request**(5장)를 만들어 팀원의 리뷰를 받습니다.
5. 리뷰가 통과되고 `main` 에 합쳐지면, 해당 브랜치는 지웁니다.

### "실수로 main 에 커밋해 버렸어요"

```bash
$ git switch -c feature/옮기기   # 현재 변경을 가져갈 새 브랜치
$ git switch main
$ git reset --hard origin/main   # main 을 원격 상태로 되돌림
```

마지막 명령은 **되돌릴 수 없으니**, 꼭 원격(`origin/main`)이 본인이 원하는 상태인지 먼저 확인해 주세요.

---

## 자주 겪는 어려움

- **"`Your branch is ahead of 'origin/main' by 3 commits` 라고 나와요."**
  로컬에는 3개의 새 커밋이 있는데 원격에는 아직 안 올라갔다는 의미입니다. `git push` 해 주시면 동기화됩니다.
- **"이미 다른 브랜치에서 일했는데 `main` 으로 옮기고 싶지 않아요."**
  옮길 필요 없습니다. 브랜치 이름을 바꾸고 거기서 계속 작업하시면 됩니다.
  ```bash
  $ git branch -m feature/원래-이름
  ```
- **"팀원이 원격에 만든 브랜치가 내 로컬에 안 보여요."**
  원격 정보를 갱신하셔야 합니다.
  ```bash
  $ git fetch
  $ git switch feature/팀원-브랜치
  ```
- **"브랜치 이름에 한글이 들어가면 어떻게 되나요?"**
  일부 환경에서 깨질 수 있습니다. 가능하면 **영문 소문자 + 하이픈**만 쓰시는 것을 추천합니다.

## 다음 단계

브랜치까지 익히셨다면, 이제 GitHub 협업의 꽃인 **Pull Request** 로 넘어갈 차례입니다.

👉 **다음 장**: [5장. Pull Request와 코드 리뷰](./05-pull-request.md)

관련 키워드: `git stash`, `git reflog`, `HEAD`, `detached HEAD`, `Git Flow`, `trunk-based development`
