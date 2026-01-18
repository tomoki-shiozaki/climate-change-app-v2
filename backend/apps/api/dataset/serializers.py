from rest_framework import serializers

from apps.dataset.models import Dataset


class DatasetSerializer(serializers.ModelSerializer):
    # ownerはユーザー側から送らせず、バックエンドで設定
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    status = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Dataset
        fields = ["id", "name", "source_file", "owner", "status", "created_at"]

    def create(self, validated_data):
        # リクエストのユーザーを owner にセット
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            validated_data["owner"] = request.user
        return super().create(validated_data)
