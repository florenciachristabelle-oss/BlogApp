import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../models/blog.dart';

class BlogController {
  final String baseUrl = kIsWeb 
      ? 'http://localhost:5000/api/posts' 
      : 'http://10.0.2.2:5000/api/posts';

  Future<List<Blog>> fetchBlogs() async {
    try {
      final response = await http.get(Uri.parse(baseUrl));

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);

        if (decoded is Map && decoded.containsKey('data')) {
          final List listData = decoded['data'];
          return listData.map((json) => Blog.fromJson(json)).toList();
        }
      }
      return [];
    } catch (e) {
      debugPrint('Fetch Error: $e');
      return [];
    }
  }

  Future<bool> createBlog({
    required String title,
    required String content,
    required String imageUrl,
    int categoryId = 1,
  }) async {
    try {
      final response = await http.post(
        Uri.parse(baseUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'title': title,
          'content': content,
          'categoryId': categoryId,
          'imageUrl': imageUrl.isEmpty ? null : imageUrl,
        }),
      );
      return response.statusCode == 201 || response.statusCode == 200;
    } catch (e) {
      debugPrint('Create Error: $e');
      return false;
    }
  }

  Future<bool> updateBlog(int id, String title, String content, String imageUrl, {int categoryId = 1}) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/$id'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'title': title,
          'content': content,
          'categoryId': categoryId,
          'imageUrl': imageUrl,
        }),
      );
      return response.statusCode == 200;
    } catch (e) {
      debugPrint('Update Error: $e');
      return false;
    }
  }

  Future<bool> deleteBlog(int id) async {
    try {
      final response = await http.delete(Uri.parse('$baseUrl/$id'));
      return response.statusCode == 200;
    } catch (e) {
      debugPrint('Delete Error: $e');
      return false;
    }
  }
}