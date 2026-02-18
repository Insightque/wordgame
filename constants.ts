import { CardType } from './types';

export interface CategoryDef {
  id: string;
  label: string;
  emoji: string;
  color: string;
  words: string[];
}

// Adjusted levels for higher word counts
export const LEVEL_SETTINGS: Record<number, { label: string; categories: number; turns: number; color: string }> = {
// --- [Tier 1] 🟢 기초 구간 (여유 턴 약간 존재) ---
  1: { label: 'Lv.1 연습', categories: 4, turns: 60, color: 'bg-green-300' },    // 카드 44장 (여유 +16)
  2: { label: 'Lv.2 입문', categories: 4, turns: 50, color: 'bg-green-400' },    // 카드 44장 (여유 +6)
  3: { label: 'Lv.3 초급', categories: 5, turns: 75, color: 'bg-emerald-300' },  // 카드 55장 (여유 +20)
  4: { label: 'Lv.4 견습', categories: 5, turns: 65, color: 'bg-emerald-400' },  // 카드 55장 (여유 +10)
  5: { label: 'Lv.5 평민', categories: 6, turns: 85, color: 'bg-teal-300' },     // 카드 66장 (여유 +19)
  6: { label: 'Lv.6 탐구', categories: 6, turns: 75, color: 'bg-teal-400' },     // 카드 66장 (여유 +9)
  7: { label: 'Lv.7 기초', categories: 7, turns: 95, color: 'bg-cyan-300' },     // 카드 77장 (여유 +18)
  8: { label: 'Lv.8 기본', categories: 7, turns: 85, color: 'bg-cyan-400' },     // 카드 77장 (여유 +8)
  9: { label: 'Lv.9 도약', categories: 8, turns: 105, color: 'bg-sky-300' },     // 카드 88장 (여유 +17)
  10: { label: 'Lv.10 성장', categories: 8, turns: 95, color: 'bg-sky-400' },    // 카드 88장 (여유 +7)

  // --- [Tier 2] 🔵 도전 구간 (동일 카테고리 내에서 짝수 레벨의 턴 압박 시작) ---
  11: { label: 'Lv.11 중급', categories: 9, turns: 115, color: 'bg-blue-300' },  // 카드 99장 (여유 +16)
  12: { label: 'Lv.12 개척', categories: 9, turns: 105, color: 'bg-blue-400' },  // 카드 99장 (여유 +6)
  13: { label: 'Lv.13 모험', categories: 10, turns: 125, color: 'bg-indigo-300' },// 카드 110장 (여유 +15)
  14: { label: 'Lv.14 투지', categories: 10, turns: 115, color: 'bg-indigo-400' },// 카드 110장 (여유 +5)
  15: { label: 'Lv.15 고급', categories: 11, turns: 135, color: 'bg-violet-300' },// 카드 121장 (여유 +14)
  16: { label: 'Lv.16 베테랑', categories: 11, turns: 125, color: 'bg-violet-400' },// 카드 121장 (여유 +4)
  17: { label: 'Lv.17 우수', categories: 12, turns: 145, color: 'bg-purple-300' },// 카드 132장 (여유 +13)
  18: { label: 'Lv.18 정예', categories: 12, turns: 135, color: 'bg-purple-400' },// 카드 132장 (여유 +3 - 매우 타이트함)
  19: { label: 'Lv.19 특수', categories: 13, turns: 155, color: 'bg-fuchsia-300' },// 카드 143장 (여유 +12)
  20: { label: 'Lv.20 숙련', categories: 13, turns: 145, color: 'bg-fuchsia-400' },// 카드 143장 (여유 +2)

  // --- [Tier 3] 🟣 고수 구간 (무의미한 보드 내 이동 시 즉각 게임 오버) ---
  21: { label: 'Lv.21 전문', categories: 14, turns: 165, color: 'bg-pink-300' }, // 카드 154장 (여유 +11)
  22: { label: 'Lv.22 엘리트', categories: 14, turns: 156, color: 'bg-pink-400' },// 카드 154장 (여유 +2)
  23: { label: 'Lv.23 선구자', categories: 15, turns: 175, color: 'bg-rose-300' },// 카드 165장 (여유 +10)
  24: { label: 'Lv.24 장인', categories: 15, turns: 167, color: 'bg-rose-400' }, // 카드 165장 (여유 +2)
  25: { label: 'Lv.25 명인', categories: 16, turns: 185, color: 'bg-red-400' },  // 카드 176장 (여유 +9)
  26: { label: 'Lv.26 대가', categories: 16, turns: 178, color: 'bg-red-500' },  // 카드 176장 (여유 +2)
  27: { label: 'Lv.27 거장', categories: 17, turns: 195, color: 'bg-orange-400' },// 카드 187장 (여유 +8)
  28: { label: 'Lv.28 권위자', categories: 17, turns: 189, color: 'bg-orange-500' },// 카드 187장 (여유 +2)
  29: { label: 'Lv.29 달인', categories: 18, turns: 205, color: 'bg-amber-400' },// 카드 198장 (여유 +7)
  30: { label: 'Lv.30 영웅', categories: 18, turns: 200, color: 'bg-amber-500' },// 카드 198장 (여유 +2)

  // --- [Tier 4] 🔴 한계 구간 (완벽한 수읽기 필요, 보드 상황 운도 따라야 함) ---
  31: { label: 'Lv.31 전설', categories: 19, turns: 215, color: 'bg-yellow-400' },// 카드 209장 (여유 +6)
  32: { label: 'Lv.32 신화', categories: 19, turns: 211, color: 'bg-yellow-500' },// 카드 209장 (여유 +2)
  33: { label: 'Lv.33 기적', categories: 20, turns: 225, color: 'bg-lime-400' }, // 카드 220장 (여유 +5)
  34: { label: 'Lv.34 불패', categories: 20, turns: 222, color: 'bg-lime-500' }, // 카드 220장 (여유 +2)
  35: { label: 'Lv.35 지배자', categories: 21, turns: 235, color: 'bg-green-500' },// 카드 231장 (여유 +4)
  36: { label: 'Lv.36 군주', categories: 21, turns: 233, color: 'bg-green-600' }, // 카드 231장 (여유 +2)
  37: { label: 'Lv.37 제왕', categories: 22, turns: 245, color: 'bg-teal-500' },  // 카드 242장 (여유 +3)
  38: { label: 'Lv.38 패왕', categories: 22, turns: 244, color: 'bg-teal-600' },  // 카드 242장 (여유 +2)
  39: { label: 'Lv.39 반신', categories: 23, turns: 255, color: 'bg-cyan-500' },  // 카드 253장 (여유 +2)
  40: { label: 'Lv.40 수호자', categories: 23, turns: 254, color: 'bg-cyan-600' }, // 카드 253장 (여유 +1)

  // --- [Tier 5] ⚫ 초월 구간 (단 1번의 삐끗함도 용납되지 않는 퍼펙트 플레이 구간) ---
  41: { label: 'Lv.41 초월', categories: 24, turns: 266, color: 'bg-blue-600' }, // 카드 264장 (여유 +2)
  42: { label: 'Lv.42 각성', categories: 24, turns: 265, color: 'bg-blue-700' }, // 카드 264장 (여유 +1)
  43: { label: 'Lv.43 해탈', categories: 25, turns: 277, color: 'bg-indigo-600' },// 카드 275장 (여유 +2)
  44: { label: 'Lv.44 무의경지', categories: 25, turns: 276, color: 'bg-indigo-700' },// 카드 275장 (여유 +1)
  45: { label: 'Lv.45 절대자', categories: 26, turns: 288, color: 'bg-purple-600' },// 카드 286장 (여유 +2)
  46: { label: 'Lv.46 불멸자', categories: 26, turns: 287, color: 'bg-purple-700' },// 카드 286장 (여유 +1)
  47: { label: 'Lv.47 신인', categories: 27, turns: 298, color: 'bg-rose-600' }, // 카드 297장 (여유 +1)
  48: { label: 'Lv.48 태초', categories: 28, turns: 309, color: 'bg-rose-700' }, // 카드 308장 (여유 +1)
  49: { label: 'Lv.49 창조주', categories: 29, turns: 320, color: 'bg-slate-700' },// 카드 319장 (여유 +1)
  50: { label: 'Lv.50 우주', categories: 30, turns: 330, color: 'bg-slate-900' } // 카드 330장 (여유 +0 : 완벽한 1턴 1분류 필수)
};

// Pastel-themed Categories (50+ Categories, ~10 Words each)
export const ALL_CATEGORIES: CategoryDef[] = [
  // --- 자연 & 우주 ---
  { id: 'space', label: '태양계', emoji: '🪐', color: '#CDB4DB', words: ['수성', '금성', '지구', '화성', '목성', '토성', '천왕성', '해왕성', '명왕성', '혜성'] },
  { id: 'cloud', label: '날씨', emoji: '☁️', color: '#BDE0FE', words: ['구름', '비', '눈', '우박', '안개', '태풍', '번개', '무지개', '소나기', '이슬'] },
  { id: 'flower', label: '꽃', emoji: '🌸', color: '#FFC8DD', words: ['장미', '튤립', '해바라기', '무궁화', '개나리', '진달래', '벚꽃', '국화', '백합', '코스모스'] },
  { id: 'gem', label: '보석', emoji: '💎', color: '#A2D2FF', words: ['다이아몬드', '루비', '사파이어', '에메랄드', '진주', '옥', '수정', '오팔', '토파즈', '호박'] },
  { id: 'tree', label: '나무', emoji: '🌳', color: '#CAFFBF', words: ['소나무', '대나무', '은행나무', '단풍나무', '버드나무', '상수리나무', '전나무', '느티나무', '자작나무', '야자수'] },
  { id: 'bug', label: '곤충', emoji: '🐞', color: '#FFADAD', words: ['나비', '잠자리', '벌', '개미', '무당벌레', '사마귀', '장수풍뎅이', '매미', '귀뚜라미', '반딧불이'] },
  { id: 'sea_ani', label: '바다생물', emoji: '🐳', color: '#9BF6FF', words: ['고래', '상어', '돌고래', '문어', '오징어', '해파리', '새우', '게', '불가사리', '거북이'] },
  { id: 'bird', label: '새', emoji: '🦜', color: '#FDFFB6', words: ['독수리', '참새', '비둘기', '까치', '부엉이', '앵무새', '펭귄', '타조', '공작', '갈매기'] },
  { id: 'dino', label: '공룡', emoji: '🦕', color: '#E2ECE9', words: ['티라노사우루스', '트리케라톱스', '브라키오사우루스', '스테고사우루스', '프테라노돈', '벨로키랍토르', '안킬로사우루스', '파키케팔로사우루스', '스피노사우루스', '이구아노돈'] },
  { id: 'land', label: '지형', emoji: '🏔️', color: '#D4C5A2', words: ['산맥', '고원', '평야', '사막', '분지', '계곡', '화산', '동굴', '섬', '반도'] },

  // --- 음식 & 요리 ---
  { id: 'fruit', label: '과일', emoji: '🍓', color: '#FFD6A5', words: ['사과', '바나나', '포도', '딸기', '수박', '복숭아', '오렌지', '파인애플', '키위', '망고'] },
  { id: 'vege', label: '채소', emoji: '🥕', color: '#CAFFBF', words: ['당근', '오이', '양파', '감자', '고구마', '시금치', '브로콜리', '양배추', '파', '마늘'] },
  { id: 'kfood', label: '한식', emoji: '🍚', color: '#FFC6FF', words: ['김치찌개', '된장찌개', '비빔밥', '불고기', '잡채', '떡볶이', '김밥', '삼계탕', '냉면', '파전'] },
  { id: 'dessert', label: '디저트', emoji: '🍰', color: '#FFC8DD', words: ['케이크', '마카롱', '아이스크림', '도넛', '초콜릿', '쿠키', '푸딩', '와플', '타르트', '빙수'] },
  { id: 'drink', label: '음료', emoji: '🥤', color: '#BDE0FE', words: ['물', '우유', '주스', '콜라', '사이다', '커피', '녹차', '홍차', '스무디', '에이드'] },
  { id: 'noodle', label: '면요리', emoji: '🍜', color: '#FDFFB6', words: ['라면', '짜장면', '짬뽕', '우동', '칼국수', '스파게티', '쌀국수', '메밀국수', '잔치국수', '쫄면'] },
  { id: 'snack', label: '분식', emoji: '🍢', color: '#FFADAD', words: ['떡볶이', '순대', '튀김', '어묵', '핫도그', '닭꼬치', '호떡', '붕어빵', '군만두', '김말이'] },
  { id: 'bread', label: '빵', emoji: '🥐', color: '#E0C097', words: ['식빵', '크로와상', '바게트', '베이글', '소보로빵', '단팥빵', '카스테라', '머핀', '스콘', '샌드위치'] },
  { id: 'sauce', label: '양념', emoji: '🧂', color: '#E5E7EB', words: ['소금', '설탕', '간장', '고추장', '된장', '식초', '참기름', '후추', '마요네즈', '케첩'] },
  
  // --- 학문 & 지식 ---
  { id: 'chem', label: '화학 원소', emoji: '⚗️', color: '#A0C4FF', words: ['수소', '헬륨', '탄소', '산소', '질소', '철', '구리', '금', '은', '알루미늄'] },
  { id: 'math', label: '수학 도형', emoji: '📐', color: '#BDB2FF', words: ['삼각형', '사각형', '원', '타원', '직육면체', '원기둥', '원뿔', '구', '마름모', '사다리꼴'] },
  { id: 'subject', label: '학교 과목', emoji: '📚', color: '#FFD6A5', words: ['국어', '수학', '영어', '사회', '과학', '체육', '음악', '미술', '도덕', '역사'] },
  { id: 'lang', label: '언어', emoji: '🗣️', color: '#9BF6FF', words: ['한국어', '영어', '중국어', '일본어', '프랑스어', '독일어', '스페인어', '러시아어', '아랍어', '라틴어'] },
  { id: 'color', label: '색깔', emoji: '🎨', color: '#FFC6FF', words: ['빨강', '주황', '노랑', '초록', '파랑', '남색', '보라', '검정', '하양', '분홍'] },
  { id: 'job', label: '직업', emoji: '👔', color: '#CAFFBF', words: ['의사', '선생님', '경찰관', '소방관', '요리사', '가수', '배우', '과학자', '변호사', '기자'] },
  { id: 'country', label: '나라', emoji: '🌏', color: '#A2D2FF', words: ['한국', '미국', '중국', '일본', '영국', '프랑스', '독일', '이탈리아', '캐나다', '호주'] },
  { id: 'capital', label: '수도', emoji: '🏙️', color: '#BDE0FE', words: ['서울', '워싱턴', '베이징', '도쿄', '런던', '파리', '베를린', '로마', '오타와', '캔버라'] },
  { id: 'planet', label: '12간지', emoji: '🐁', color: '#FDFFB6', words: ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭'] },

  // --- 생활 & 문화 ---
  { id: 'clothes', label: '의류', emoji: '👕', color: '#FFADAD', words: ['티셔츠', '바지', '치마', '원피스', '코트', '패딩', '양말', '신발', '모자', '장갑'] },
  { id: 'house', label: '가구', emoji: '🪑', color: '#D4C5A2', words: ['침대', '책상', '의자', '식탁', '소파', '옷장', '서랍장', '신발장', '거울', '책장'] },
  { id: 'appliance', label: '가전제품', emoji: '📺', color: '#BDE0FE', words: ['냉장고', '세탁기', '청소기', '에어컨', '선풍기', '텔레비전', '다리미', '전자레인지', '드라이기', '컴퓨터'] },
  { id: 'sports', label: '스포츠', emoji: '⚽', color: '#CAFFBF', words: ['축구', '야구', '농구', '배구', '테니스', '수영', '골프', '탁구', '배드민턴', '양궁'] },
  { id: 'music', label: '악기', emoji: '🎻', color: '#FFC6FF', words: ['피아노', '바이올린', '기타', '드럼', '플루트', '첼로', '트럼펫', '하프', '색소폰', '오르간'] },
  { id: 'stationery', label: '문구', emoji: '✏️', color: '#FDFFB6', words: ['연필', '지우개', '볼펜', '자', '가위', '풀', '공책', '필통', '샤프', '색연필'] },
  { id: 'bathroom', label: '욕실용품', emoji: '🛁', color: '#A0C4FF', words: ['비누', '샴푸', '린스', '치약', '칫솔', '수건', '면도기', '로션', '빗', '세면대'] },
  { id: 'kitchen', label: '주방용품', emoji: '🍳', color: '#FFD6A5', words: ['냄비', '후라이팬', '칼', '도마', '국자', '뒤집개', '그릇', '접시', '숟가락', '젓가락'] },
  { id: 'transport', label: '탈것', emoji: '🚗', color: '#A2D2FF', words: ['자동차', '버스', '기차', '비행기', '자전거', '오토바이', '배', '지하철', '택시', '헬리콥터'] },
  
  // --- 추상 & 기타 ---
  { id: 'emotion', label: '감정', emoji: '😊', color: '#FFC8DD', words: ['기쁨', '슬픔', '분노', '행복', '사랑', '우울', '놀람', '공포', '부끄러움', '지루함'] },
  { id: 'time', label: '시간', emoji: '⏰', color: '#E2ECE9', words: ['초', '분', '시', '일', '주', '월', '년', '오전', '오후', '새벽'] },
  { id: 'season', label: '절기/계절', emoji: '🍂', color: '#CAFFBF', words: ['입춘', '경칩', '춘분', '하지', '입추', '추분', '동지', '봄', '여름', '가을'] },
  { id: 'shape', label: '무늬', emoji: '🏁', color: '#E5E7EB', words: ['줄무늬', '체크', '땡땡이', '호피', '꽃무늬', '민무늬', '물방울', '격자', '빗살', '나선'] },
  { id: 'taste', label: '맛', emoji: '👅', color: '#FFADAD', words: ['단맛', '짠맛', '신맛', '쓴맛', '매운맛', '고소한맛', '느끼한맛', '담백한맛', '떫은맛', '감칠맛'] },
  { id: 'sound', label: '의성어', emoji: '🔊', color: '#FDFFB6', words: ['멍멍', '야옹', '꿀꿀', '음메', '찍찍', '꼬끼오', '개굴개굴', '엉금엉금', '깡충깡충', '살금살금'] },
  { id: 'family', label: '가족', emoji: '👨‍👩‍👧', color: '#FFC6FF', words: ['할아버지', '할머니', '아빠', '엄마', '형', '누나', '동생', '삼촌', '이모', '고모'] },
  { id: 'body', label: '신체', emoji: '💪', color: '#FFD6A5', words: ['머리', '어깨', '무릎', '발', '눈', '코', '입', '귀', '손', '배'] },
  { id: 'fairy', label: '전래동화', emoji: '📖', color: '#A0C4FF', words: ['콩쥐팥쥐', '흥부놀부', '심청전', '해님달님', '선녀와나무꾼', '토끼와거북이', '견우와직녀', '금도끼은도끼', '호랑이와곶감', '우렁각시'] },
  { id: 'constellation', label: '별자리', emoji: '✨', color: '#BDE0FE', words: ['물병자리', '물고기자리', '양자리', '황소자리', '쌍둥이자리', '게자리', '사자자리', '처녀자리', '천칭자리', '전갈자리'] },
  // --- 🔬 과학 & 수학 (Science & Math) ---
  { id: 'physics', label: '물리학', emoji: '⚛️', color: '#BDE0FE', words: ['관성', '가속도', '열역학', '전자기유도', '양자역학', '상대성이론', '굴절', '회절', '부력', '마찰력'] },
  { id: 'biology', label: '생명과학', emoji: '🧬', color: '#CAFFBF', words: ['미토콘드리아', '엽록체', '리보솜', '염색체', '유전자', '효소', '호르몬', '항상성', '광합성', '세포분열'] },
  { id: 'earth_sci', label: '지구과학', emoji: '🌋', color: '#E2ECE9', words: ['판구조론', '편서풍', '해령', '해구', '엘니뇨', '라니냐', '퇴적암', '변성암', '화성암', '오존층'] },
  { id: 'chemistry', label: '화학반응', emoji: '🧪', color: '#A0C4FF', words: ['공유결합', '이온결합', '산화', '환원', '촉매', '동위원소', '고분자', '탄화수소', '산성', '염기성'] },
  { id: 'astronomy', label: '천문학', emoji: '🌌', color: '#CDB4DB', words: ['빅뱅이론', '블랙홀', '초신성', '적색거성', '백색왜성', '은하수', '퀘이사', '성운', '성단', '펄사'] },
  { id: 'genetics', label: '유전학', emoji: '🔬', color: '#FFC6FF', words: ['우성', '열성', '돌연변이', '복제', '전사', '번역', '유전체', '플라스미드', '뉴클레오타이드', '코돈'] },
  { id: 'human_body', label: '신경/혈액', emoji: '🧠', color: '#FFADAD', words: ['대뇌', '소뇌', '연수', '간뇌', '척수', '교감신경', '부교감신경', '백혈구', '적혈구', '혈소판'] },
  { id: 'ecology', label: '생태계', emoji: '🌿', color: '#D4C5A2', words: ['생산자', '소비자', '분해자', '먹이사슬', '천이', '군집', '개체군', '생물군계', '생물다양성', '공생'] },
  { id: 'climate', label: '기후/환경', emoji: '🌤️', color: '#FDFFB6', words: ['열대우림', '사바나', '스텝', '사막', '지중해성', '온대계절풍', '서안해양성', '냉대', '툰드라', '빙설'] },
  { id: 'renewable', label: '신재생에너지', emoji: '☀️', color: '#9BF6FF', words: ['태양광', '풍력', '지열', '조력', '파력', '수력', '바이오매스', '수소에너지', '연료전지', '폐기물에너지'] },
  { id: 'math_concept', label: '수학 개념', emoji: '∑', color: '#BDB2FF', words: ['미분', '적분', '확률', '통계', '무한대', '로그', '시그마', '행렬', '벡터', '실수'] },
  { id: 'geometry', label: '기하학', emoji: '📐', color: '#FFD6A5', words: ['피타고라스', '삼각비', '사인', '코사인', '탄젠트', '호도법', '부채꼴', '원주율', '포물선', '쌍곡선'] },

  // --- 💻 IT & 테크놀로지 (IT & Technology) ---
  { id: 'future_tech', label: '첨단 기술', emoji: '🚀', color: '#FFC8DD', words: ['인공지능', '빅데이터', '블록체인', '메타버스', '사물인터넷', '증강현실', '가상현실', '자율주행', '양자컴퓨터', '딥러닝'] },
  { id: 'data_struct', label: '자료구조', emoji: '🗂️', color: '#CAFFBF', words: ['스택', '큐', '연결리스트', '트리', '그래프', '해시테이블', '힙', '배열', '데크', '맵'] },
  
  // --- 🏛️ 역사 & 인문 (History & Humanities) ---
  { id: 'kor_hist', label: '한국사', emoji: '📜', color: '#FDFFB6', words: ['살수대첩', '귀주대첩', '팔만대장경', '훈민정음', '임진왜란', '갑신정변', '동학농민운동', '3·1운동', '6·25전쟁', '4·19혁명'] },
  { id: 'world_hist', label: '세계사', emoji: '🌍', color: '#A0C4FF', words: ['산업혁명', '프랑스혁명', '르네상스', '십자군전쟁', '종교개혁', '세계대공황', '1차세계대전', '2차세계대전', '냉전', '러시아혁명'] },
  { id: 'philosophy', label: '서양 철학', emoji: '🤔', color: '#FFC8DD', words: ['이데아', '변증법', '실존주의', '공리주의', '정언명령', '계몽주의', '경험론', '합리론', '스토아학파', '에피쿠로스학파'] },
  { id: 'eastern_phil', label: '동양 철학', emoji: '☯️', color: '#CAFFBF', words: ['인의예지', '성선설', '성악설', '이기이원론', '무위자연', '호연지기', '제자백가', '불교', '유교', '도교'] },
  { id: 'greek_myth', label: '그리스 신화', emoji: '⚡', color: '#BDE0FE', words: ['제우스', '포세이돈', '하데스', '아테나', '아폴론', '헤르메스', '아프로디테', '아레스', '디오니소스', '데메테르'] },
  { id: 'ancient_civ', label: '고대 문명', emoji: '🏺', color: '#D4C5A2', words: ['메소포타미아', '이집트', '인더스', '황하', '잉카', '마야', '아스테카', '페니키아', '헤브라이', '미노아'] },
  { id: 'lit_concept', label: '문학 개념', emoji: '📖', color: '#FFC6FF', words: ['은유', '환유', '역설', '반어', '복선', '시점', '카타르시스', '클리셰', '미장센', '데우스엑스마키나'] },
  { id: 'kor_classic', label: '고전문학', emoji: '📖', color: '#FFD6A5', words: ['구운몽', '춘향전', '심청전', '홍길동전', '관동별곡', '사미인곡', '청산별곡', '향가', '시조', '가사'] },
  { id: 'grammar', label: '국어 문법', emoji: '✍️', color: '#A2D2FF', words: ['형태소', '어절', '접사', '어근', '피동', '사동', '높임법', '시제', '종결어미', '관형어'] },
  { id: 'idiom', label: '사자성어', emoji: '🐉', color: '#FFADAD', words: ['결초보은', '토사구팽', '다기망양', '새옹지마', '호가호위', '낭중지추', '역지사지', '온고지신', '권선징악', '대기만성'] },
  { id: 'logic', label: '논리학', emoji: '🧠', color: '#E2ECE9', words: ['연역법', '귀납법', '삼단논법', '모순', '흑백논리', '성급한일반화','허수아비치기', '순환논리', '대우'] },

  // --- ⚖️ 사회 & 경제 (Society & Economy) ---
  { id: 'politics', label: '정치/법', emoji: '⚖️', color: '#BDB2FF', words: ['삼권분립', '민주주의', '헌법', '기본권', '국회', '행정부', '사법부', '선거', '정당', '여론'] },
  { id: 'economy', label: '경제 지표', emoji: '📈', color: '#FDFFB6', words: ['수요', '공급', '인플레이션', '디플레이션', '기회비용', '독점', '과점', '국내총생산', '환율', '금리'] },
  { id: 'law', label: '법률 용어', emoji: '⚖️', color: '#CDB4DB', words: ['민법', '형법', '소송', '기소', '판결', '구속', '집행유예', '정당방위', '저작권', '특허권'] },
  { id: 'sociology', label: '사회학 개념', emoji: '🤝', color: '#9BF6FF', words: ['사회화', '아노미', '관료제', '일탈', '계층', '양극화', '저출산', '고령화', '다문화', '대중매체'] },
  { id: 'geography', label: '지리 개념', emoji: '🗺️', color: '#FFC8DD', words: ['지형도', '등고선', '위도', '경도', '본초자오선', '적도', '대륙붕', '해류', '백야', '극야'] },
  { id: 'global_org', label: '국제 기구', emoji: '🇺🇳', color: '#BDE0FE', words: ['국제연합', '세계무역기구', '세계보건기구', '국제통화기금', '경제협력개발기구', '북대서양조약기구', '유럽연합', '동남아시아국가연합', '유네스코', '유니세프'] },
  { id: 'finance', label: '금융/투자', emoji: '💰', color: '#CAFFBF', words: ['주식', '채권', '펀드', '배당금', '코스피', '나스닥', '가상화폐', '선물', '옵션', '어음'] },
  { id: 'trade', label: '국제 무역', emoji: '🚢', color: '#E5E7EB', words: ['수출', '수입', '관세', '자유무역협정', '흑자', '적자', '보호무역', '덤핑', '할당제', '금수조치'] },
  { id: 'psychology', label: '심리학', emoji: '🛋️', color: '#FFD6A5', words: ['트라우마', '콤플렉스', '인지부조화', '방어기제', '파블로프', '플라시보', '피그말리온', '무의식', '자존감', '우울증'] },
  { id: 'treaties', label: '역사적 조약', emoji: '🤝', color: '#A0C4FF', words: ['베스트팔렌', '베르사유', '얄타', '포츠담', '마스트리흐트', '교토의정서', '제네바협약', '샌프란시스코', '한미상호방위', '남북기본합의서'] },

  // --- 🎨 문화 & 예술 (Culture & Art) ---
  { id: 'art_movement', label: '미술 사조', emoji: '🖼️', color: '#FFC6FF', words: ['인상주의', '입체파', '초현실주의', '야수파', '낭만주의', '르네상스', '바로크', '로코코', '팝아트', '추상표현주의'] },
  { id: 'music_term', label: '음악 용어', emoji: '🎵', color: '#D4C5A2', words: ['소나타', '교향곡', '아리아', '오라토리오', '칸타타', '아카펠라', '크레센도', '스타카토', '포르테', '안단테'] },
  { id: 'architecture', label: '건축 양식', emoji: '🏛️', color: '#FFADAD', words: ['고딕', '로마네스크', '비잔틴', '르네상스', '바로크', '바우하우스', '한옥', '파고다', '이슬람', '아르데코'] },
  { id: 'film_term', label: '영화/방송', emoji: '🎬', color: '#BDE0FE', words: ['몽타주', '롱테이크', '미장센', '페이드인', '컷어웨이', '플래시백', '맥거핀', '시놉시스', '콘티', '크랭크업'] },
  { id: 'instruments', label: '오케스트라', emoji: '🎻', color: '#CAFFBF', words: ['바이올린', '비올라', '첼로', '콘트라베이스', '하프', '플루트', '오보에', '클라리넷', '바순', '팀파니'] },
  { id: 'world_lit', label: '세계 문학가', emoji: '🖋️', color: '#FDFFB6', words: ['셰익스피어', '괴테', '톨스토이', '도스토옙스키', '헤밍웨이', '카프카', '빅토르위고', '오웰', '마르케스', '헤르만헤세'] },
  { id: 'classical_music', label: '클래식 작곡가', emoji: '🎼', color: '#CDB4DB', words: ['바흐', '모차르트', '베토벤', '쇼팽', '슈베르트', '브람스', '차이코프스키', '바그너', '비발디', '헨델'] },
  { id: 'art_tech', label: '미술 기법', emoji: '🖌️', color: '#FFC8DD', words: ['프레스코', '템페라', '유화', '수채화', '판화', '데생', '모자이크', '콜라주', '스푸마토', '임파스토'] },
  { id: 'unesco', label: '한국 유네스코', emoji: '🇰🇷', color: '#E2ECE9', words: ['석굴암', '불국사', '종묘', '창덕궁', '수원화성', '해인사', '남한산성', '하회마을', '고창고인돌', '조선왕릉'] }
];

export const TOTAL_COLUMNS = 4;