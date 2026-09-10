sed -i '/<button/,/m-nav-wishlist/!b; /m-nav-wishlist/,/<\/button>/c\
        <button\
          id="m-nav-wishlist"\
          onClick={() => setIsWishlistOpen(true)}\
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-neutral-500 hover:text-[#111111] transition-all relative"\
        >\
          <div className="relative">\
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? '\''text-[#111111] fill-white'\'' : '\''\''}`} />\
            {wishlist.length > 0 && (\
              <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 text-[9px] font-bold font-mono bg-white text-black rounded-full border border-black/20">\
                {wishlist.length}\
              </span>\
            )}\
          </div>\
          <span className="text-[10px] mt-1 font-medium">{isAr ? '\''المفضلة'\'' : '\''Wishlist'\''}</span>\
        </button>
' src/components/MobileBottomNav.tsx
