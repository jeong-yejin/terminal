# ReboundX Design System

> 소스: `Color-semantic.json` · `Color-atomic.json` · `Space.json` · `Size.json` · `Radius.json` · `Text.json`
> 테마: **Dark mode 단일**
> 폰트: **Manrope** (Google Fonts)

---

## 목차

1. [Color Semantic](#1-color-semantic)
2. [Color Atomic](#2-color-atomic)
3. [Typography](#3-typography)
4. [Spacing](#4-spacing)
5. [Border Radius](#5-border-radius)
6. [Size](#6-size)
7. [Tailwind 클래스 레퍼런스](#7-tailwind-클래스-레퍼런스)

---

## 1. Color Semantic

> Semantic 토큰은 Color Atomic 팔레트를 의미 단위로 매핑한 레이어입니다.
> 코드에서는 반드시 Semantic 토큰을 사용합니다.

### 1-1. Static

| 토큰 | Hex | 설명 |
|------|-----|------|
| `color-semantic/static/white` | `#FFFFFF` | 항상 흰색 |
| `color-semantic/static/black` | `#0A0A0A` | 항상 검정 |

---

### 1-2. Label (텍스트 색상)

| 토큰 | Hex | 용도 |
|------|-----|------|
| `label/strong` | `#FFFFFF` | 최우선 텍스트, 제목 |
| `label/normal` | `#F5F5F5` | 기본 본문 텍스트 |
| `label/neutral` | `#D4D4D4` | 서브 텍스트 |
| `label/assistive` | `#A3A3A3` | 보조 설명, caption |
| `label/alternative` | `#737373` | placeholder, 비활성 힌트 |
| `label/disable` | `#525252` | 비활성(disabled) 텍스트 |
| `label/inverse` | `#0A0A0A` | 밝은 배경 위 텍스트 |

---

### 1-3. Background (배경)

| 토큰 | Hex | 계층 | 용도 |
|------|-----|------|------|
| `background/normal-normal` | `#0A0A0A` | L0 | 페이지 최하단 배경 |
| `background/normal-alternative` | `#171717` | L1 | 사이드바, 카드 |
| `background/elevated-normal` | `#262626` | L2 | hover, 테이블 헤더 |
| `background/elevated-alternative` | `#404040` | L3 | 더 높은 강조 |
| `background/inverse` | `#F5F5F5` | — | 라이트 배경 |
| `background/brand` | `#CAFF5D` | — | 브랜드 강조 배경 |

---

### 1-4. Line (테두리)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `line/normal-normal` | `rgba(255, 255, 255, 0.20)` | 카드·섹션 구분선 (기본) |
| `line/normal-neutral` | `rgba(255, 255, 255, 0.09)` | 미세한 구분선 |
| `line/normal-alternative` | `rgba(255, 255, 255, 0.06)` | 극히 미세한 구분선 |
| `line/solid-normal` | `#E5E5E5` | 라이트모드 기본 구분선 |
| `line/solid-neutral` | `#D4D4D4` | 라이트모드 서브 구분선 |
| `line/solid-alternative` | `#A3A3A3` | 라이트모드 보조 구분선 |

---

### 1-5. Status (상태)

| 토큰 | Hex | 사용처 |
|------|-----|--------|
| `status/positive` | `#22C55E` | 수익, 연결됨, 성공 |
| `status/cautionary` | `#FBBF24` | 경고, 주의 |
| `status/negative` | `#EF4444` | 손실, 오류, 연결 해제 |
| `status/info` | `#60A5FA` | 정보 안내 |

---

### 1-6. Primary (브랜드 색상)

| 토큰 | Hex | 용도 |
|------|-----|------|
| `primary/normal` | `#CAFF5D` | 주요 CTA, 활성 아이콘, 포커스 링 |
| `primary/strong` | `#B3E84E` | hover 상태 |
| `primary/heavy` | `#96C941` | pressed 상태 |

---

### 1-7. Interaction

| 토큰 | Hex | 용도 |
|------|-----|------|
| `interaction/default` | `#FAFAFA` | 기본 인터랙티브 요소 |
| `interaction/inactive` | `#737373` | 비활성 상태 |
| `interaction/disable` | `#525252` | 완전 비활성 |

---

### 1-8. Outline

| 토큰 | 값 | 용도 |
|------|-----|------|
| `outline/default` | `rgba(255, 255, 255, 0.48)` | 기본 포커스 아웃라인 |
| `outline/hover` | `#B3E84E` | hover 아웃라인 |
| `outline/selected` | `#CAFF5D` | 선택된 아웃라인 |

---

### 1-9. Accent

| 토큰 | 값 | 용도 |
|------|-----|------|
| `accent/background-primary` | `rgba(202, 255, 93, 0.10)` | Primary 색상 틴트 배경 |
| `accent/background-green` | `rgba(34, 197, 94, 0.10)` | 긍정 상태 배경 |
| `accent/background-amber` | `rgba(245, 158, 11, 0.10)` | 경고 상태 배경 |
| `accent/background-red` | `rgba(239, 68, 68, 0.10)` | 에러 상태 배경 |
| `accent/background-blue` | `rgba(59, 130, 246, 0.10)` | 정보 상태 배경 |
| `accent/foreground-primary` | `#B3E84E` | Primary 틴트 전경 |
| `accent/foreground-green` | `#22C55E` | 긍정 전경 |
| `accent/foreground-amber` | `#F59E0B` | 경고 전경 |
| `accent/foreground-red` | `#EF4444` | 에러 전경 |
| `accent/foreground-blue` | `#3B82F6` | 정보 전경 |

---

### 1-10. Fill (채움)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `fill/normal` | `rgba(26, 26, 26, 0.06)` | 기본 fill |
| `fill/strong` | `rgba(26, 26, 26, 0.09)` | 강조 fill |
| `fill/alternative` | `rgba(26, 26, 26, 0.20)` | 대안 fill |
| `fill/heavy` | `rgba(26, 26, 26, 0.28)` | 강한 fill |

---

### 1-11. Inverse

| 토큰 | Hex | 용도 |
|------|-----|------|
| `inverse/primary` | `#CAFF5D` | 반전 배경 위 primary |
| `inverse/background` | `#0A0A0A` | 반전 배경 |
| `inverse/label` | `#F5F5F5` | 반전 배경 위 텍스트 |

---

### 1-12. Material

| 토큰 | 값 | 용도 |
|------|-----|------|
| `material/dimmer` | `rgba(255, 255, 255, 0.48)` | 딤 오버레이 |

---

## 2. Color Atomic

> Atomic 팔레트는 Semantic 토큰의 근간입니다.
> 직접 사용하지 말고 Semantic 토큰을 통해 참조합니다.

### 2-1. Primary (브랜드)

| Shade | Hex | 스와치 |
|-------|-----|--------|
| 100 | `#F9FFE9` | 연한 라임 |
| 200 | `#EEFFB9` | |
| 300 | `#E3FF8A` | |
| 400 | `#D7FF6B` | |
| **500** | **`#CAFF5D`** | **브랜드 키컬러** |
| 600 | `#B3E84E` | hover |
| 700 | `#96C941` | pressed |
| 800 | `#6D9832` | |
| 900 | `#2E4A1F` | |

---

### 2-2. Neutral (회색 계열)

| Shade | Hex |
|-------|-----|
| 50 | `#FAFAFA` |
| 100 | `#F5F5F5` |
| 200 | `#E5E5E5` |
| 300 | `#D4D4D4` |
| 400 | `#A3A3A3` |
| **500** | **`#737373`** |
| 600 | `#525252` |
| 700 | `#404040` |
| 800 | `#262626` |
| 900 | `#171717` |
| 950 | `#0A0A0A` |

---

### 2-3. Green (긍정)

| Shade | Hex |
|-------|-----|
| 50 | `#F0FDF4` |
| 100 | `#DCFCE7` |
| 200 | `#BBF7D0` |
| 300 | `#86EFAC` |
| 400 | `#4ADE80` |
| **500** | **`#22C55E`** |
| 600 | `#16A34A` |
| 700 | `#15803D` |
| 800 | `#166534` |
| 900 | `#14532D` |
| 950 | `#052E16` |

---

### 2-4. Red (에러/손실)

| Shade | Hex |
|-------|-----|
| 50 | `#FEF2F2` |
| 100 | `#FEE2E2` |
| 200 | `#FECACA` |
| 300 | `#FCA5A5` |
| 400 | `#F87171` |
| **500** | **`#EF4444`** |
| 600 | `#DC2626` |
| 700 | `#B91C1C` |
| 800 | `#991B1B` |
| 900 | `#7F1D1D` |
| 950 | `#450A0A` |

---

### 2-5. Amber (경고)

| Shade | Hex |
|-------|-----|
| 50 | `#FFFBEB` |
| 100 | `#FEF3C7` |
| 200 | `#FDE68A` |
| 300 | `#FCD34D` |
| **400** | **`#FBBF24`** |
| 500 | `#F59E0B` |
| 600 | `#D97706` |
| 700 | `#B45309` |
| 800 | `#92400E` |
| 900 | `#78350F` |
| 950 | `#451A03` |

---

### 2-6. Blue (정보)

| Shade | Hex |
|-------|-----|
| 50 | `#EFF6FF` |
| 100 | `#DBEAFE` |
| 200 | `#BFDBFE` |
| 300 | `#93C5FD` |
| **400** | **`#60A5FA`** |
| 500 | `#3B82F6` |
| 600 | `#2563EB` |
| 700 | `#1D4ED8` |
| 800 | `#1E40AF` |
| 900 | `#1E3A8A` |
| 950 | `#172554` |

---

### 2-7. 기타 팔레트

| 팔레트 | 500 키컬러 | 용도 |
|--------|-----------|------|
| Orange | `#F97316` | 주의/알림 |
| Yellow | `#EAB308` | 강조 |
| Indigo | `#6366F1` | |
| Violet | `#8B5CF6` | |
| Purple | `#A855F7` | |

---

### 2-8. Alpha (투명도 기반)

| 토큰 | White alpha | Black alpha | 용도 |
|------|-------------|-------------|------|
| alpha-dark/50 | 6% | — | 극히 미세 오버레이 |
| alpha-dark/100 | 9% | — | 미세 구분선 |
| alpha-dark/200 | 20% | — | 카드 경계 |
| alpha-dark/300 | 28% | — | |
| alpha-dark/500 | 48% | — | dimmer |
| alpha-light/50 | — | 6% | |
| alpha-light/200 | — | 20% | fill.alternative |

---

## 3. Typography

> 폰트 패밀리: **Manrope** (Google Fonts)
> `@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700&display=swap")`

### 3-1. Desktop — Titles

| 스타일 | 크기 | 굵기 | Line Height | Letter Spacing | 사용처 |
|--------|------|------|-------------|----------------|--------|
| `Desktop/titles/h1/bold` | 64px | 700 | 120% | −2% | 최상위 히어로 타이틀 |
| `Desktop/titles/h1/medium` | 64px | 500 | 120% | −2% | |
| `Desktop/titles/h1/regular` | 64px | 400 | 120% | −2% | |
| `Desktop/titles/h2/bold` | 48px | 700 | 120% | −2% | 섹션 타이틀 |
| `Desktop/titles/h2/medium` | 48px | 500 | 120% | −2% | |
| `Desktop/titles/h2/regular` | 48px | 400 | 120% | −2% | |
| `Desktop/titles/h3/bold` | 40px | 700 | 120% | −2% | 서브 섹션 |
| `Desktop/titles/h3/medium` | 40px | 500 | 120% | −2% | |
| `Desktop/titles/h3/regular` | 40px | 400 | 120% | −2% | |
| `Desktop/titles/h4/bold` | 32px | 700 | 120% | −2% | 카드 타이틀 |
| `Desktop/titles/h4/medium` | 32px | 500 | 120% | −2% | |
| `Desktop/titles/h4/regular` | 32px | 400 | 120% | −2% | |
| `Desktop/titles/h5/bold` | 24px | 700 | 120% | −2% | 소제목 |
| `Desktop/titles/h5/medium` | 24px | 500 | 120% | −2% | |
| `Desktop/titles/h5/regular` | 24px | 400 | 120% | −2% | |

---

### 3-2. Desktop — Body

| 스타일 | 크기 | 굵기 | Line Height | 사용처 |
|--------|------|------|-------------|--------|
| `Desktop/Body/1/bold` | 20px | 700 | 150% | 강조 본문 |
| `Desktop/Body/1/medium` | 20px | 500 | 150% | 주요 수치 |
| `Desktop/Body/1/regular` | 20px | 400 | 150% | 기본 본문 large |
| `Desktop/Body/2/bold` | 18px | 700 | 150% | |
| `Desktop/Body/2/medium` | 18px | 500 | 150% | |
| `Desktop/Body/2/regular` | 18px | 400 | 150% | |
| `Desktop/Body/3/bold` | 16px | 700 | 150% | 강조 본문 small |
| `Desktop/Body/3/medium` | 16px | 500 | 150% | |
| `Desktop/Body/3/regular` | 16px | 400 | 150% | 기본 본문 |

---

### 3-3. Desktop — Label & Caption

| 스타일 | 크기 | 굵기 | Line Height | 사용처 |
|--------|------|------|-------------|--------|
| `Desktop/Label/1/bold` | 14px | 700 | 140% | 버튼 라벨, 태그 |
| `Desktop/Label/1/medium` | 14px | 500 | 140% | 메뉴 아이템, 필터 |
| `Desktop/Label/1/regular` | 14px | 400 | 140% | 일반 라벨 |
| `Desktop/Label/2/bold` | 13px | 700 | 140% | |
| `Desktop/Label/2/medium` | 13px | 500 | 140% | 서브 라벨 |
| `Desktop/Label/2/regular` | 13px | 400 | 140% | |
| `Desktop/Caption/bold` | 12px | 700 | 140% | 강조 캡션 |
| `Desktop/Caption/medium` | 12px | 500 | 140% | |
| `Desktop/Caption/regular` | 12px | 400 | 140% | 날짜, 보조 설명 |

---

## 4. Spacing

> 두 가지 스케일이 존재합니다.
> - **Space** (Space.json): 컴포넌트 내부 패딩/마진용
> - **Size** (Size.json): 컴포넌트 크기(width/height)용

### 4-1. Space 스케일

| 토큰 | 값 | px | Tailwind class |
|------|----|----|----------------|
| `space/zero` | 0 | 0px | `p-0` |
| `space/px` | 1 | 1px | `p-px` |
| `space/xxs` | 2 | 2px | `space-xxs` |
| `space/xs2` | 4 | 4px | `space-xs2` |
| `space/xs` | 8 | 8px | `space-xs` |
| `space/sm` | 12 | 12px | `space-sm` |
| `space/base` | 16 | 16px | `space-base` |
| `space/md` | 20 | 20px | `space-md` |
| `space/lg` | 24 | 24px | `space-lg` |
| `space/xl` | 28 | 28px | `space-xl` |
| `space/xl2` | 32 | 32px | `space-xl2` |
| `space/xl3` | 40 | 40px | `space-xl3` |
| `space/xl4` | 48 | 48px | `space-xl4` |
| `space/xl5` | 60 | 60px | `space-xl5` |
| `space/xl6` | 72 | 72px | `space-xl6` |

### 4-2. Size 스케일

| 토큰 | 값 | px | 주요 용도 |
|------|----|----|-----------|
| `size/zero` | 0 | 0px | |
| `size/xxs` | 2 | 2px | 구분선 두께 |
| `size/xs` | 4 | 4px | 아이콘 뱃지 |
| `size/sm` | 8 | 8px | 작은 아이콘 |
| `size/base` | 12 | 12px | |
| `size/lg` | 16 | 16px | 아이콘 기본 크기 |
| `size/xl` | 20 | 20px | |
| `size/2xl` | 24 | 24px | 중형 아이콘 |
| `size/3xl` | 32 | 32px | 아바타 small |
| `size/4xl` | 40 | 40px | 아바타 medium |
| `size/5xl` | 48 | 48px | 아바타 large |

---

## 5. Border Radius

| 토큰 | 값 | Tailwind class | 용도 |
|------|-----|----------------|------|
| `radius/none` | 0px | `rounded-none` | |
| `radius/sm` | 2px | `rounded-sm` | 뱃지, 태그 |
| `radius/md` | 4px | `rounded-md` | 버튼, 인풋, 메뉴 아이템 |
| `radius/lg` | 8px | `rounded-lg` | 탭, 셀렉트 |
| `radius/xl` | 12px | `rounded-xl` | 카드, 모달 |
| `radius/2xl` | 16px | `rounded-2xl` | 큰 카드 |
| `radius/3xl` | 24px | `rounded-3xl` | |
| `radius/4xl` | 32px | `rounded-4xl` | |
| `radius/5xl` | 48px | `rounded-5xl` | |
| `radius/full` | 999px | `rounded-full` | 알약형 버튼, 아바타, 토글 |

---

## 6. Size

> `Size.json` 기반 컴포넌트 치수 가이드

| 토큰 | px | 사용 예 |
|------|-----|---------|
| `size/lg` (16px) | 16 | 아이콘 — 인라인 |
| `size/xl` (20px) | 20 | 아이콘 — 버튼 내부 |
| `size/2xl` (24px) | 24 | 아이콘 — 독립형 |
| `size/3xl` (32px) | 32 | 프로필 아바타 small |
| `size/4xl` (40px) | 40 | 프로필 아바타 medium |
| `size/5xl` (48px) | 48 | 프로필 아바타 large |

---

## 7. Tailwind 클래스 레퍼런스

> `tailwind.config.ts` + `globals.css`에 등록된 커스텀 토큰 클래스 목록

### 7-1. 색상 클래스

#### Background & Surface
| Tailwind class | 값 | CSS Variable |
|----------------|----|--------------|
| `bg-background` | `#0A0A0A` | `--color-bg-base` |
| `bg-surface-1` | `#171717` | `--color-surface-1` |
| `bg-surface-2` | `#262626` | `--color-surface-2` |
| `bg-surface-3` | `#404040` | `--color-surface-3` |

> opacity modifier 지원: `bg-surface-2/60`, `bg-surface-2/30` 등

#### Text
| Tailwind class | 값 | 설명 |
|----------------|----|------|
| `text-text-primary` | `#FFFFFF` | label/strong |
| `text-text-secondary` | `#D4D4D4` | label/neutral |
| `text-text-tertiary` | `#A3A3A3` | label/assistive |
| `text-text-disabled` | `#737373` | label/alternative |
| `text-text-inverse` | `#0A0A0A` | label/inverse |
| `text-icon-secondary` | `#737373` | 아이콘 기본 색 |

#### Brand & Status
| Tailwind class | 값 | 설명 |
|----------------|----|------|
| `text-primary` / `bg-primary` | `#CAFF5D` | primary/normal |
| `text-primary-strong` | `#B3E84E` | primary/strong (hover) |
| `text-positive` / `bg-positive` | `#22C55E` | status/positive |
| `text-negative` / `bg-negative` | `#EF4444` | status/negative |
| `text-cautionary` / `bg-cautionary` | `#FBBF24` | status/cautionary |
| `text-info` / `bg-info` | `#60A5FA` | status/info |

> opacity modifier: `bg-positive/10`, `bg-negative/10` 등

#### Border
| Tailwind class | 값 | 설명 |
|----------------|----|------|
| `border-border-subtle` | `rgba(255,255,255,0.20)` | line/normal-normal |
| `border-border-normal` | `rgba(255,255,255,0.09)` | line/normal-neutral |

---

### 7-2. 타이포그래피 클래스

#### 폰트 사이즈 (Tailwind extend)
| Class | 크기 | Line Height |
|-------|------|-------------|
| `text-display-h1` | 64px | 120% |
| `text-display-h2` | 48px | 120% |
| `text-display-h3` | 40px | 120% |
| `text-display-h4` | 32px | 120% |
| `text-display-h5` | 24px | 120% |
| `text-body-1` | 20px | 150% |
| `text-body-2` | 18px | 150% |
| `text-body-3` | 16px | 150% |
| `text-label-1` | 14px | 140% |
| `text-label-2` | 13px | 140% |
| `text-caption` | 12px | 140% |

#### Tailwind 기본 클래스 대응
| Tailwind 기본 | 크기 | 대응 디자인 토큰 |
|---------------|------|-----------------|
| `text-xs` | 12px | Caption |
| `text-sm` | 14px | Label/1 |
| `text-base` | 16px | Body/3 |
| `text-lg` | 18px | Body/2 |
| `text-xl` | 20px | Body/1 |

---

### 7-3. Border Radius 클래스

| Class | 값 | 토큰 |
|-------|----|------|
| `rounded-sm` | 2px | radius/sm |
| `rounded-md` | 4px | radius/md |
| `rounded-lg` | 8px | radius/lg |
| `rounded-xl` | 12px | radius/xl |
| `rounded-2xl` | 16px | radius/2xl |
| `rounded-full` | 9999px | radius/full |

---

### 7-4. 컴포넌트 패턴 예시

#### 카드
```tsx
<div className="rounded-xl border border-border-subtle bg-surface-1 p-5">
  {/* 또는 유틸 클래스: className="card" */}
</div>
```

#### 기본 버튼 (Primary CTA)
```tsx
<button className="
  h-9 rounded-md bg-primary px-4
  text-sm font-medium text-text-inverse
  hover:bg-primary-strong
  focus-visible:outline focus-visible:outline-2
  focus-visible:outline-offset-2 focus-visible:outline-primary
  disabled:opacity-40 disabled:cursor-not-allowed
">
  버튼 라벨
</button>
```

#### 상태 뱃지
```tsx
{/* Positive */}
<span className="rounded-full bg-positive/10 px-2.5 py-0.5 text-xs font-medium text-positive">
  Connected
</span>

{/* Negative */}
<span className="rounded-full bg-negative/10 px-2.5 py-0.5 text-xs font-medium text-negative">
  Error
</span>
```

#### 테이블 행
```tsx
<tr className="border-b border-white/10 hover:bg-surface-2/30">
  <td className="px-4 py-3 text-sm text-text-primary">...</td>
  <td className="px-4 py-3 text-sm text-text-secondary">...</td>
  <td className="px-4 py-3 text-sm text-text-tertiary">...</td>
</tr>
```

#### 포커스 링
```tsx
// 공통 focus-ring 유틸 (globals.css 등록)
<button className="focus-ring">...</button>

// 직접 사용
<button className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
  ...
</button>
```

---

## 부록: CSS Custom Properties 전체 목록

```css
:root {
  /* Background */
  --color-bg-base:    10 10 10;       /* #0A0A0A */
  --color-surface-1:  23 23 23;       /* #171717 */
  --color-surface-2:  38 38 38;       /* #262626 */
  --color-surface-3:  64 64 64;       /* #404040 */

  /* Label */
  --color-label-strong:      255 255 255;  /* #FFFFFF */
  --color-label-normal:      245 245 245;  /* #F5F5F5 */
  --color-label-neutral:     212 212 212;  /* #D4D4D4 */
  --color-label-assistive:   163 163 163;  /* #A3A3A3 */
  --color-label-alternative: 115 115 115;  /* #737373 */
  --color-label-disable:     82 82 82;     /* #525252 */
  --color-label-inverse:     10 10 10;     /* #0A0A0A */

  /* Line */
  --color-line-normal-normal:      rgba(255, 255, 255, 0.20);
  --color-line-normal-neutral:     rgba(255, 255, 255, 0.09);
  --color-line-normal-alternative: rgba(255, 255, 255, 0.06);

  /* Primary */
  --color-primary-normal: 202 255 93;   /* #CAFF5D */
  --color-primary-strong: 179 232 78;   /* #B3E84E */
  --color-primary-heavy:  150 201 65;   /* #96C941 */

  /* Status */
  --color-status-positive:   34 197 94;   /* #22C55E */
  --color-status-negative:   239 68 68;   /* #EF4444 */
  --color-status-cautionary: 251 191 36;  /* #FBBF24 */
  --color-status-info:       96 165 250;  /* #60A5FA */

  /* Accent */
  --color-accent-bg-primary: rgba(202, 255, 93, 0.10);
  --color-accent-bg-green:   rgba(34, 197, 94, 0.10);
  --color-accent-bg-amber:   rgba(245, 158, 11, 0.10);
  --color-accent-bg-red:     rgba(239, 68, 68, 0.10);
  --color-accent-bg-blue:    rgba(59, 130, 246, 0.10);
}
```
