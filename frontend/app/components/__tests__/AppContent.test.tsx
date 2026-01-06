import { render, screen } from "@testing-library/react";
import { AppContent } from "@/app/components/AppContent";

/* =========================
   Next.js hooks のモック
========================= */
const mockUsePathname = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

/* =========================
   AuthContext のモック
========================= */
const mockUseAuthContext = vi.fn();

vi.mock("@/features/auth/context", () => ({
  useAuthContext: () => mockUseAuthContext(),
}));

/* =========================
   ErrorContext のモック
========================= */
const mockClearError = vi.fn();

vi.mock("@/context/error", () => ({
  useErrorContext: () => ({
    clearError: mockClearError,
  }),
}));

/* =========================
   apiClient / logger のモック
========================= */
vi.mock("@/features/auth/api/apiClient", () => ({
  apiClient: {
    get: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock("@/lib/logger", () => ({
  logInfo: vi.fn(),
  logWarn: vi.fn(),
}));

/* =========================
   AppLayout のモック
========================= */
vi.mock("@/app/components/AppLayout", () => ({
  AppLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-layout">{children}</div>
  ),
}));

/* =========================
   FullScreenLoading のモック
========================= */
vi.mock("@/components/common", () => ({
  FullScreenLoading: ({ message }: { message: string }) => <div>{message}</div>,
}));

/* =========================
   テスト本体
========================= */
describe("AppContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue("/test");
  });

  it("authLoading が true のとき FullScreenLoading を表示する", () => {
    mockUseAuthContext.mockReturnValue({ authLoading: true });

    render(
      <AppContent>
        <div>Children</div>
      </AppContent>
    );

    expect(screen.getByText("読み込み中...")).toBeInTheDocument();
  });

  it("authLoading が false のとき children を AppLayout 内に表示する", () => {
    mockUseAuthContext.mockReturnValue({ authLoading: false });

    render(
      <AppContent>
        <div>Children</div>
      </AppContent>
    );

    expect(screen.getByTestId("app-layout")).toBeInTheDocument();
    expect(screen.getByText("Children")).toBeInTheDocument();
  });

  it("pathname が変わると clearError が呼ばれる", () => {
    mockUseAuthContext.mockReturnValue({ authLoading: false });

    const { rerender } = render(
      <AppContent>
        <div>Children</div>
      </AppContent>
    );

    expect(mockClearError).toHaveBeenCalledTimes(1);

    mockUsePathname.mockReturnValue("/other");

    rerender(
      <AppContent>
        <div>Children</div>
      </AppContent>
    );

    expect(mockClearError).toHaveBeenCalledTimes(2);
  });
});
