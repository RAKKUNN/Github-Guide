# 6장. 병합 충돌(Merge Conflict) 해결하기

> **이 장을 다 읽으시면**
> - 병합 충돌이 왜, 언제 생기는지 이해하시게 됩니다.
> - 충돌 마커(`<<<<<<<`, `=======`, `>>>>>>>`)를 읽고 해석하실 수 있습니다.
> - VS Code의 Merge Editor 또는 터미널에서 충돌을 해결하실 수 있습니다.
> - 충돌이 발생할 확률을 **미리 줄이는 습관**을 익히시게 됩니다.
> - 충돌 해결을 포기하고 되돌리는 `git merge --abort` 같은 탈출구를 알게 되십니다.

---

## 6.1 충돌은 왜 생기나요?

Git은 똑똑하지만 완벽하지는 않습니다. **같은 파일의 같은 줄**을 서로 다른 두 사람이 다르게 고쳤다면, Git은 어느 쪽이 맞는지 판단할 수 없습니다. 그래서 **사람에게 결정을 넘깁니다**. 이때의 상태를 **병합 충돌(merge conflict)** 이라고 부릅니다.

충돌은 이럴 때 자주 나타납니다.

- 같은 함수의 같은 줄을 A와 B가 각자 다르게 수정
- 한쪽은 파일을 수정했는데, 다른 쪽은 같은 파일을 삭제
- 같은 위치에 서로 다른 새 함수를 삽입

> 💡 충돌은 **잘못이 아니라 자연스러운 신호**입니다. "이 부분은 협업자와 한 번 확인이 필요해요" 라고 Git이 알려 주는 것입니다.

## 6.2 충돌이 발생하는 상황 재현해 보기

혼자서도 충돌을 안전하게 연습하실 수 있습니다. [3장](./03-first-repo.md)에서 만든 `hello-github` 저장소에서 해 보겠습니다.

```bash
$ git switch main
$ git pull
$ git switch -c feature/ko
$ echo "안녕하세요!" >> README.md
$ git commit -am "docs: 한국어 인사 추가"

$ git switch main
$ git switch -c feature/en
$ echo "Hello!" >> README.md
$ git commit -am "docs: 영어 인사 추가"
```

두 브랜치가 **README.md 의 같은 위치(맨 끝)** 에 서로 다른 줄을 더했습니다. 이제 합쳐 봅니다.

```bash
$ git switch main
$ git merge feature/ko
$ git merge feature/en
```

마지막 명령에서 아래와 비슷한 메시지가 뜹니다.

```
Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
Automatic merge failed; fix conflicts and then commit the result.
```

**이때 당황하지 마세요**. 일단 `git status` 로 상태를 확인하시면 됩니다.

```bash
$ git status
```

```
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
	both modified:   README.md
```

## 6.3 충돌 마커 읽는 법

충돌이 생긴 파일을 열면 **이상한 기호**가 박혀 있습니다.

```text
<<<<<<< HEAD
안녕하세요!
=======
Hello!
>>>>>>> feature/en
```

이 기호의 의미는 다음과 같습니다.

- `<<<<<<< HEAD` ~ `=======` : **현재 브랜치(지금 서 있는 쪽)** 의 내용. 이 예에서는 `main` (이미 `feature/ko` 가 merge 되어 있음).
- `=======` ~ `>>>>>>> feature/en` : **합치려는 브랜치** 의 내용.

해결은 간단합니다. **기호들을 포함해 파일을 원하는 최종 상태로 고쳐 주시면 됩니다.** 예를 들어 둘 다 살리고 싶다면 이렇게 바꿔 주세요.

```text
안녕하세요!
Hello!
```

한쪽만 남기고 싶다면 다른 쪽을 지우시고, 완전히 새로 쓰셔도 됩니다. **중요한 건 `<<<<<<<`, `=======`, `>>>>>>>` 기호가 파일에 남아 있지 않게 하는 것**입니다.

## 6.4 VS Code Merge Editor로 편하게 풀기

VS Code로 저장소를 여시면, 충돌이 난 파일에 위쪽에 네 가지 버튼이 나타납니다.

- **Accept Current Change**: 현재 브랜치 버전만 남기기
- **Accept Incoming Change**: 합쳐 오는 브랜치 버전만 남기기
- **Accept Both Changes**: 둘 다 남기기
- **Compare Changes**: 두 버전을 나란히 비교

또는 VS Code 우측 하단의 **Resolve in Merge Editor** 버튼을 누르시면, 세 칸(현재 / 들어오는 / 결과) 으로 나뉜 **Merge Editor** 가 열립니다. 결과 칸에서 원하는 부분을 체크하며 최종본을 만들어 가시면 됩니다.

편집이 끝나면 상단 **Complete Merge** 를 눌러 주세요.

## 6.5 충돌 해결 마무리

파일을 원하는 상태로 고치신 뒤에는, **"해결했다"고 Git에게 알려 주는 작업**이 남아 있습니다.

```bash
$ git add README.md          # 충돌을 해결한 파일을 staging
$ git status                  # 모든 충돌이 해결됐는지 확인
$ git commit                  # 기본 병합 메시지로 커밋
```

`git commit` 을 옵션 없이 치시면 기본 에디터에 **병합 커밋 메시지**가 미리 채워져 있습니다. 그대로 저장·닫으시면 됩니다.

다시 push 하시면 원격도 동기화됩니다.

```bash
$ git push
```

## 6.6 PR에서 충돌이 났을 때

GitHub 웹 PR 페이지에서 "This branch has conflicts" 라고 뜨는 경우, 해결은 **내 컴퓨터(로컬)** 에서 합니다.

```bash
$ git switch feature/login
$ git fetch origin
$ git merge origin/main      # main 의 최신 변경을 내 브랜치로 가져옴
# 충돌 해결 (위 6.3 ~ 6.5 참고)
$ git push
```

push 하시면 PR이 자동으로 갱신되고, GitHub의 빨간 경고가 초록색으로 바뀝니다.

> 💡 GitHub 웹에서도 간단한 충돌은 **Resolve conflicts** 버튼으로 직접 편집이 가능합니다. 하지만 여러 파일이 얽혔거나 충돌 범위가 크면 로컬에서 푸는 편이 훨씬 안전합니다.

## 6.7 포기하고 되돌리고 싶다면

해결이 너무 복잡해서 원상 복구하고 싶으시다면:

```bash
$ git merge --abort
```

merge를 시작하기 **직전 상태**로 완전히 되돌립니다. 충돌로 만들어진 파일들도 원래대로 돌아갑니다.

이미 `git add` 까지 해서 중간 단계에 있더라도 이 명령은 대부분 안전하게 동작합니다. 혹시 모르니 중요한 변경은 먼저 `git stash` 로 따로 보관해 두시는 습관을 들이시면 좋습니다.

## 6.8 충돌을 **덜 겪기** 위한 습관

이론적으로 충돌은 피할 수 없지만, 빈도와 규모는 크게 줄이실 수 있습니다.

1. **자주 pull, 자주 push**
   ```bash
   $ git switch main && git pull && git switch feature/login && git merge main
   ```
   작업 중에도 주기적으로 `main` 의 최신 상태를 내 브랜치에 녹여 주세요. 한 번에 몰아서 합치면 충돌도 그만큼 커집니다.
2. **작은 PR 자주 올리기**
   거대한 PR 하나보다, 작은 PR 여러 개가 훨씬 충돌에 강합니다.
3. **작업 영역 나누기**
   팀원끼리 "나는 인증 모듈, 너는 결제 모듈" 식으로 미리 구역을 나누시면 같은 파일을 동시에 건드릴 확률이 낮아집니다.
4. **커밋 단위는 작게**
   한 번에 천 줄 고친 커밋은 충돌이 나면 원인 파악이 어렵습니다. "한 가지 일" 단위로 커밋해 주세요.
5. **공용 파일 주의**
   `package.json`, `README.md`, 설정 파일처럼 모두가 손대는 파일은 팀에서 **수정 규칙**을 미리 정해 두시면 좋습니다.

---

## 자주 겪는 어려움

- **"충돌 마커를 지우는 걸 깜빡하고 커밋해 버렸어요."**
  다행히 Git은 이 경우 많이 막아 주지만, 마커가 그대로 커밋되었다면 다시 열어 지우시고 `git commit --amend` 하시면 됩니다. 이미 push 까지 했다면 추가 커밋으로 고치시는 편이 안전합니다.
- **"`git pull` 했는데 충돌이 나요."**
  `pull` 은 내부적으로 `fetch + merge` 입니다. 충돌 해결 절차는 이 장에서 본 것과 같습니다. 먼저 로컬에 커밋되지 않은 변경이 있다면 정리부터 해 주세요.
- **"자꾸 같은 줄에서 충돌이 나요."**
  팀원과 실시간으로 논의해서 **누가 무엇을 맡을지** 정하시는 게 가장 빠릅니다. Git은 기술만 제공할 뿐, 의사소통을 대신해 주지는 않습니다.
- **"실수로 충돌을 잘못 해결해서 남의 코드를 지웠어요."**
  방금 커밋이라면 `git reflog` 로 이전 상태 해시를 찾아 `git reset --hard <해시>` 로 되돌릴 수 있습니다. 다만 팀원에게 먼저 알리시는 것이 예의입니다.

## 다음 단계

충돌이 무섭지 않게 되셨다면, 이제 **내가 쓰기 권한이 없는 저장소** 에 기여하는 방법을 배울 차례입니다.

👉 **다음 장**: [7장. Fork와 Upstream으로 기여하기](./07-fork-upstream.md)

관련 키워드: `git rebase` (충돌 해결 방식 중 하나), `three-way merge`, `ours/theirs`, `mergetool`, `git stash`
