# prodoctorov-test-task
Приложение подгружает список пользователей, их альбомы и фотографии, которые можно сохранить в избранное

ОПИСАНИЕ API:
1. Список пользователей https://json.medrating.org/users/
2. Список альбомов по пользователям https://json.medrating.org/albums?userId=3
3. Список фотографий альбома https://json.medrating.org/photos?albumId=2


1. При входе на страницу подгружается только список пользователей. Альбомы и
фотографии загружаются при клике на списки.
2. При нажатии на фото оно отображается в полноразмерном формате.
3. При клике на звезду:
  a) Если фотография не в избранном - она попадает в список избранного, а звезда
становится активной (жёлтой).
  b) Если фотография в избранном - она удаляется из списка избранного, а звезда
становится неактивной (серой).
4. Приложение запоминает избранные фотографии даже после перезагрузки
страницы.
5. Переключение между вкладками происходит без перезагрузки страниц.

ВКЛАДКА «КАТАЛОГ»:
1. Списки раскрываются и закрываются при клике на них.
2. При клике на пользователя открывается его список альбомов.
3. При клике на альбом раскрывается его список фотографий.
4. При наведении курсора на фотографию всплывает название этого фото (title).

ВКЛАДКА «ИЗБРАННОЕ»:
1. Здесь отображаются избранные фотографии, это фото, у которых нажали на звезду.
2. Рядом с фотографией отображается название.
