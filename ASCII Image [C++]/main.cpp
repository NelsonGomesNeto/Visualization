#include <bits/stdc++.h>

const std::string_view kClearScreen = "\e[2J";
const std::string_view kMoveTo00 = "\e[0;0H";
const std::string_view kResetColor = "\e[0m";

//                             0123456
const std::string kAsciiMap = " .-*o#@";
char Ascii(const int brightness) { return kAsciiMap[brightness]; }

struct Pixel {
  const uint8_t r = 0, g = 0, b = 0;
  Pixel() {}
  Pixel(const uint8_t r_, const uint8_t g_, const uint8_t b_)
      : r(r_), g(g_), b(b_) {}
  int Hex() const { return ((int)r << 16) | ((int)g << 8) | (int)b; }
  std::string AnsiEscapeColor() const {
    return std::format("\e[38;2;{};{};{}m", r, g, b);
  }
};
template <>
struct std::formatter<Pixel> {
  constexpr auto parse(std::format_parse_context& ctx) { return ctx.begin(); }
  template <class FormatContext>
  auto format(const Pixel& p, FormatContext& ctx) const {
    return std::format_to(ctx.out(), "0x{:06X}", p.Hex());
    // return std::format_to(ctx.out(), "{}", p.r);
  }
};

struct Image {
  const std::vector<std::vector<Pixel>> pixels;
  const int n, m;
  Image(const std::vector<std::vector<Pixel>>& pixels_)
      : pixels(pixels_), n(pixels.size()), m(pixels[0].size()) {}

  static Image BuildImage(const std::string& image_filepath) {
    std::ifstream fin(image_filepath, std::ios::binary);
    std::string header;
    std::getline(fin, header);
    assert(header == "P6");
    int n, m;
    fin >> m >> n;
    fin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    std::getline(fin, header);
    assert(header == "255");
    std::vector<std::vector<Pixel>> pixels(n, std::vector<Pixel>{});
    const std::string raw_pixels(std::istreambuf_iterator<char>(fin), {});
    for (auto [i, line] : pixels | std::views::enumerate) {
      line.reserve(m);
      for (int j = 0; j < m; ++j) {
        const int px_pos = (i * m + j) * 3;
        const uint8_t r = raw_pixels[px_pos], g = raw_pixels[px_pos + 1],
                      b = raw_pixels[px_pos + 2];
        line.emplace_back(r, g, b);
      }
    }
    std::println("Built {} x {} image | pixels[0][:4]: {}", n, m,
                 pixels[0] | std::views::take(5));
    return Image(pixels);
  }

  void PrintAscii(const int letter_size) const {
    const double ratio = (double)1 / letter_size;
    const int an = std::ceil(n * ratio), am = std::ceil(m * ratio);
    std::println("original size: {} x {}", n, m);
    std::println("letter_size: {} {} -> {} x {}", letter_size, ratio, an, am);

    const int area = letter_size * letter_size;
    // std::print("{}{}{}", kClearScreen, kMoveTo00, kResetColor);
    for (int i = 0; i < n; i += letter_size) {
      for (int j = 0; j < m; j += letter_size) {
        int r = 0, g = 0, b = 0;
        for (int bi = 0; bi < letter_size && i + bi < n; ++bi) {
          for (int bj = 0; bj < letter_size && j + bj < m; ++bj) {
            r += pixels[i + bi][j + bj].r;
            g += pixels[i + bi][j + bj].g;
            b += pixels[i + bi][j + bj].b;
          }
        }
        r /= area, g /= area, b /= area;
        assert(r >= 0 && r < 256);
        assert(g >= 0 && g < 256);
        assert(b >= 0 && b < 256);
        const int brightness = (r * 3 + g * 5 + b * 2) / 255 / 2;
        // const int brightness = (r * 2 + g * 8 + b * 2) / 255 / 2;
        assert(brightness < kAsciiMap.size());
        const Pixel pixel(r, g, b);
        // Try switching to painting the background on empty space instead!
        std::print("{}{}", pixel.AnsiEscapeColor(), Ascii(brightness));
      }
      std::println("");
    }
  }
};

int main(int argc, char* argv[]) {
  if (argc < 3) {
    std::println("Missing arguments!");
    return 1;
  }
  const Image image = Image::BuildImage(std::string(argv[1]));
  const int letter_size = std::stoi(argv[2]);
  image.PrintAscii(letter_size);

  return 0;
}