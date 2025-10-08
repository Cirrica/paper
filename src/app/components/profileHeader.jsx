import Image from "next/image";
export default function ProfileHeader({ user, balances }) {
  return (
    <div className="flex items-center justify-between mb-8 ">
      {/* Left: Profile */}
      <div className="flex">
        <div className="flex items-center gap-2">
          <Image
            src="/arrowDown.svg"
            alt="arrowDown"
            width={16}
            height={16}
            
          />
          <Image
            src={user.profilePicture}
            alt="Profile"
            width={24}
            height={24}
            className="rounded-full"
          />
          <div>
            <div className="text-[14.45px]">{user.name}</div>
            <div className="text-[12px] text-gray-400">
              Account: {user.accountNumber}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <span className="text-gray-600 ml-2 my-1">|</span>

          <Image
            src="/bell.svg"
            alt="Bell"
            width={11}
            height={12}
            className=" mb-1"
          />
          <div className="text-center">
            <div className="text-gray-400 text-[12px]">Portfolio Balance</div>
            <div className="text-[14.45px]">
              ${balances.portfolio.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-400 text-[12px]">Available Funds</div>
            <div className="text-[14.45px]">
              ${balances.available.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      {/* Right: Search */}
      <div className="flex items-center rounded-md px-3 py-2 h-[31px] bg-dark-gray ml-9 border-t border-l border-r border-gray-500 focus:outline-none">
        <Image
          src="/search.svg"
          alt="Search"
          width={16}
          height={16}
          className="mr-2 opacity-70"
        />
        <input
          type="text"
          placeholder="Search"
          width={200}
          height={29}
          className="px-1 mr-1 text-[13px] bg-dark-gray text-white focus:outline-none h-[26px] w-[199px] "
        />
      </div>
    </div>
  );
}
