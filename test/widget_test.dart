// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter_test/flutter_test.dart';
import '../lib/main.dart';

void main() {
  testWidgets('Blog App smoke test', (WidgetTester tester) async {
    // Ubah BlogApp() menjadi MyApp() sesuai kelas di main.dart
    await tester.pumpWidget(const MyApp());

    // Memastikan halaman awal (Login) berhasil muncul
    expect(find.text('Selamat Datang'), findsOneWidget);
  });
}