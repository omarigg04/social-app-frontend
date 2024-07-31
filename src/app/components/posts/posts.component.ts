import { Component, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
import { map, switchMap } from 'rxjs/operators';
import { PostService } from "src/app/services/post.service";
import { UserService } from "src/app/services/user.service";
import { AuthService } from "src/app/services/auth.service";
import { Post } from "src/app/models/Post";
import { User } from "src/app/models/User";

@Component({
  selector: "app-posts",
  templateUrl: "./posts.component.html",
  styleUrls: ["./posts.component.scss"],
})
export class PostsComponent implements OnInit {
  posts$: Observable<Post[]>;
  userId: number;
  userNames: { [key: number]: Observable<string> } = {};

  constructor(
    private postService: PostService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.posts$ = this.fetchAll();
    this.userId = this.authService.userId;
  }

  fetchAll(): Observable<Post[]> {
    return this.postService.fetchAll();
  }

  createPost(): void {
    this.posts$ = this.fetchAll();
  }

  delete(postId: Pick<Post, "id">): void {
    this.postService
      .deletePost(postId)
      .subscribe(() => (this.posts$ = this.fetchAll()));
  }

  getUserName(userId: number): Observable<string> {
    if (!this.userNames[userId]) {
      this.userNames[userId] = this.userService.getUserById(userId).pipe(
        map((user: User) => user.name)
      );
    }
    return this.userNames[userId];
  }
}
